import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const PASSKEYS_FILE = path.resolve(DATA_DIR, 'passkeys.json');

// Ensure local persistence data dir exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(PASSKEYS_FILE)) {
    fs.writeFileSync(PASSKEYS_FILE, JSON.stringify([]), 'utf8');
  }
}

export function generateChallenge() {
  return crypto.randomBytes(32).toString('base64url');
}

// In-memory challenge store with 5-minute TTL
const activeChallenges = new Map();

export function storeChallenge(challenge, metadata = {}) {
  activeChallenges.set(challenge, {
    ...metadata,
    createdAt: Date.now()
  });

  // Prune expired challenges (> 5 mins)
  const now = Date.now();
  for (const [key, val] of activeChallenges.entries()) {
    if (now - val.createdAt > 5 * 60 * 1000) {
      activeChallenges.delete(key);
    }
  }
}

export function consumeChallenge(challenge) {
  if (!challenge) return null;
  const item = activeChallenges.get(challenge);
  if (item) {
    activeChallenges.delete(challenge);
    if (Date.now() - item.createdAt <= 5 * 60 * 1000) {
      return item;
    }
  }
  return null;
}

export async function getPasskeys(email) {
  ensureDataDir();
  const normalizedEmail = email ? email.toLowerCase().trim() : null;

  // 1. Try local JSON store
  let localKeys = [];
  try {
    const raw = fs.readFileSync(PASSKEYS_FILE, 'utf8');
    localKeys = JSON.parse(raw);
    if (normalizedEmail) {
      localKeys = localKeys.filter(k => k.email.toLowerCase() === normalizedEmail);
    }
  } catch (err) {
    console.warn('Local passkeys read error:', err.message);
  }

  // 2. Try Supabase passkey_credentials table
  try {
    const supabase = await createClient();
    if (supabase) {
      let query = supabase.from('passkey_credentials').select('*');
      if (normalizedEmail) {
        query = query.ilike('email', normalizedEmail);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        // Merge without duplicates by credential_id
        const map = new Map();
        localKeys.forEach(k => map.set(k.credentialId || k.credential_id, k));
        data.forEach(k => {
          const id = k.credential_id || k.id;
          map.set(id, {
            credentialId: id,
            email: k.email,
            publicKey: k.public_key,
            deviceName: k.device_name || 'Biometric Authenticator',
            createdAt: k.created_at
          });
        });
        return Array.from(map.values());
      }
    }
  } catch (err) {
    // Supabase table may not exist yet, local fallback used
  }

  return localKeys;
}

export async function savePasskey({ email, name, credentialId, publicKey, deviceName }) {
  ensureDataDir();
  const record = {
    credentialId,
    email: email.toLowerCase().trim(),
    name: name || email.split('@')[0],
    publicKey: publicKey || '',
    deviceName: deviceName || 'Windows Hello / Touch ID',
    createdAt: new Date().toISOString()
  };

  // 1. Save to local JSON store
  try {
    const raw = fs.readFileSync(PASSKEYS_FILE, 'utf8');
    const list = JSON.parse(raw);
    const filtered = list.filter(k => k.credentialId !== credentialId);
    filtered.push(record);
    fs.writeFileSync(PASSKEYS_FILE, JSON.stringify(filtered, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write local passkey:', err);
  }

  // 2. Best-effort save to Supabase
  try {
    const supabase = await createClient();
    if (supabase) {
      await supabase.from('passkey_credentials').upsert({
        credential_id: credentialId,
        email: record.email,
        public_key: record.publicKey,
        device_name: record.deviceName,
        created_at: record.createdAt
      }, { onConflict: 'credential_id' });
    }
  } catch (err) {
    // Non-fatal, local persistence ensures passkey still functions
  }

  return record;
}
