import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const ACCOUNTS_FILE = path.resolve(DATA_DIR, 'accounts.json');
const TMP_ACCOUNTS_FILE = path.resolve('/tmp', 'accounts.json');

// In-memory fallback cache for serverless runtimes (e.g. Vercel)
let inMemoryAccounts = [];

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(ACCOUNTS_FILE)) {
      fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify([]), 'utf8');
    }
  } catch {
    // Non-fatal in read-only serverless environments like AWS Lambda / Vercel
  }
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

export function verifyPassword(password, salt, hash) {
  try {
    const computed = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(hash, 'hex'));
  } catch (err) {
    return false;
  }
}

export function getLocalAccounts() {
  ensureDataDir();

  // 1. Try reading from project data file (local dev)
  try {
    if (fs.existsSync(ACCOUNTS_FILE)) {
      const raw = fs.readFileSync(ACCOUNTS_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const map = new Map();
        parsed.forEach(a => map.set(a.email.toLowerCase(), a));
        inMemoryAccounts.forEach(a => map.set(a.email.toLowerCase(), a));
        inMemoryAccounts = Array.from(map.values());
        return inMemoryAccounts;
      }
    }
  } catch (err) {
    // Disk read failed, continue to /tmp
  }

  // 2. Try reading from serverless /tmp file
  try {
    if (fs.existsSync(TMP_ACCOUNTS_FILE)) {
      const raw = fs.readFileSync(TMP_ACCOUNTS_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const map = new Map();
        parsed.forEach(a => map.set(a.email.toLowerCase(), a));
        inMemoryAccounts.forEach(a => map.set(a.email.toLowerCase(), a));
        inMemoryAccounts = Array.from(map.values());
        return inMemoryAccounts;
      }
    }
  } catch (err) {
    // /tmp read failed
  }

  return inMemoryAccounts;
}

export function findLocalAccount(email) {
  if (!email) return null;
  const accounts = getLocalAccounts();
  return accounts.find(a => a.email.toLowerCase() === email.toLowerCase().trim()) || null;
}

export function saveLocalAccount({ email, name, password }) {
  ensureDataDir();
  const normalizedEmail = email.toLowerCase().trim();
  const accounts = getLocalAccounts();
  const existing = accounts.find(a => a.email.toLowerCase() === normalizedEmail);

  const { salt, hash } = hashPassword(password);
  const record = {
    id: existing ? existing.id : crypto.randomUUID(),
    email: normalizedEmail,
    name: name || normalizedEmail.split('@')[0],
    salt,
    hash,
    createdAt: existing ? existing.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updated = accounts.filter(a => a.email.toLowerCase() !== normalizedEmail);
  updated.push(record);

  inMemoryAccounts = updated;

  // Best-effort write to local file, fallback to /tmp, suppress errors in serverless
  try {
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(updated, null, 2), 'utf8');
  } catch {
    try {
      fs.writeFileSync(TMP_ACCOUNTS_FILE, JSON.stringify(updated, null, 2), 'utf8');
    } catch {}
  }

  return record;
}

export function updateLocalAccount(email, fields = {}) {
  const normalizedEmail = email.toLowerCase().trim();
  const accounts = getLocalAccounts();
  const target = accounts.find(a => a.email.toLowerCase() === normalizedEmail);
  if (!target) return null;

  if (fields.name) target.name = fields.name;
  target.updatedAt = new Date().toISOString();

  inMemoryAccounts = accounts;

  try {
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2), 'utf8');
  } catch {
    try {
      fs.writeFileSync(TMP_ACCOUNTS_FILE, JSON.stringify(accounts, null, 2), 'utf8');
    } catch {}
  }

  return target;
}

export function deleteLocalAccount(email) {
  const normalizedEmail = email.toLowerCase().trim();
  const accounts = getLocalAccounts();
  const filtered = accounts.filter(a => a.email.toLowerCase() !== normalizedEmail);
  inMemoryAccounts = filtered;

  try {
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(filtered, null, 2), 'utf8');
  } catch {
    try {
      fs.writeFileSync(TMP_ACCOUNTS_FILE, JSON.stringify(filtered, null, 2), 'utf8');
    } catch {}
  }

  return true;
}
