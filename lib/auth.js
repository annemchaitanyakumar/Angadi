import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const ACCOUNTS_FILE = path.resolve(DATA_DIR, 'accounts.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ACCOUNTS_FILE)) {
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify([]), 'utf8');
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
  try {
    const raw = fs.readFileSync(ACCOUNTS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
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

  fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(updated, null, 2), 'utf8');
  return record;
}
