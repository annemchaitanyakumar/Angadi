import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const PASSKEYS_FILE = path.resolve(DATA_DIR, 'passkeys.json');
const TMP_PASSKEYS_FILE = path.resolve('/tmp', 'passkeys.json');

let inMemoryPasskeys = [];

// Ensure local persistence data dir exists (non-fatal in serverless)
function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(PASSKEYS_FILE)) {
      fs.writeFileSync(PASSKEYS_FILE, JSON.stringify([]), 'utf8');
    }
  } catch {
    // Non-fatal in read-only serverless runtimes
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

  // 1. Try local JSON store or /tmp
  let localKeys = [...inMemoryPasskeys];
  try {
    if (fs.existsSync(PASSKEYS_FILE)) {
      const raw = fs.readFileSync(PASSKEYS_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const map = new Map();
        parsed.forEach(k => map.set(k.credentialId || k.credential_id, k));
        localKeys.forEach(k => map.set(k.credentialId || k.credential_id, k));
        localKeys = Array.from(map.values());
      }
    }
  } catch (err) {}

  try {
    if (fs.existsSync(TMP_PASSKEYS_FILE)) {
      const raw = fs.readFileSync(TMP_PASSKEYS_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const map = new Map();
        parsed.forEach(k => map.set(k.credentialId || k.credential_id, k));
        localKeys.forEach(k => map.set(k.credentialId || k.credential_id, k));
        localKeys = Array.from(map.values());
      }
    }
  } catch (err) {}

  inMemoryPasskeys = localKeys;

  if (normalizedEmail) {
    localKeys = localKeys.filter(k => k.email && k.email.toLowerCase() === normalizedEmail);
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

  const filtered = inMemoryPasskeys.filter(k => k.credentialId !== credentialId);
  filtered.push(record);
  inMemoryPasskeys = filtered;

  // 1. Save to local JSON store or /tmp (non-fatal)
  try {
    fs.writeFileSync(PASSKEYS_FILE, JSON.stringify(filtered, null, 2), 'utf8');
  } catch {
    try {
      fs.writeFileSync(TMP_PASSKEYS_FILE, JSON.stringify(filtered, null, 2), 'utf8');
    } catch {}
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
