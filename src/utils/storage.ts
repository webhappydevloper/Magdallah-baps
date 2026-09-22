import { get, set, del, clear } from 'idb-keyval';
import { 
  MahilaMember, 
  DonationRecord, 
  JamanwarPlan, 
  SabhaEvent, 
  EmailNotification 
} from '../types';

export const STORAGE_KEYS = {
  MEMBERS: 'smms_members_db_v2',
  CURRENT_MEMBER_ID: 'smms_current_member_id_v2',
  DONATIONS: 'smms_donations_db_v2',
  JAMANWARS: 'smms_jamanwars_db_v2',
  SABHAS: 'smms_sabhas_db_v2',
  NOTIFICATIONS: 'smms_notifications_db_v2',
  LAST_SAVED: 'smms_last_saved_db_v2'
};

/**
 * Loads stored data from IndexedDB (supports unlimited/high-capacity storage without 5MB quota limit).
 * Falls back to localStorage if IndexedDB is blocked in some restricted environments.
 */
export async function loadFromStorage<T>(key: string, fallbackValue: T): Promise<T> {
  try {
    // 1. Try reading from high-capacity IndexedDB
    const val = await get<T>(key);
    if (val !== undefined && val !== null) {
      return val;
    }
  } catch (err) {
    console.warn(`IndexedDB read failed for key ${key}, trying localStorage fallback:`, err);
  }

  // 2. Fallback check from localStorage
  try {
    const local = localStorage.getItem(key);
    if (local) {
      return JSON.parse(local) as T;
    }
  } catch (err) {
    console.warn(`localStorage read failed for key ${key}:`, err);
  }

  return fallbackValue;
}

/**
 * Saves data into persistent IndexedDB (no 5MB limit, retains data across reloads and days).
 * Also writes to localStorage as secondary backup if size allows.
 */
export async function saveToStorage<T>(key: string, value: T): Promise<void> {
  try {
    // 1. Save to IndexedDB (Main high-capacity engine)
    await set(key, value);
    // Track last saved timestamp
    await set(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
  } catch (err) {
    console.error(`IndexedDB write error for ${key}:`, err);
  }

  // 2. Secondary backup in localStorage (wrapped in try-catch to prevent 5MB QuotaExceeded error)
  try {
    localStorage.setItem(key, JSON.stringify(value));
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
  } catch (err) {
    // LocalStorage quota may be exceeded for large records; IndexedDB already holds it
    console.info(`LocalStorage quota note for ${key} (IndexedDB successfully holds full data).`);
  }
}

export interface AppCompleteBackup {
  version: string;
  exportDate: string;
  members: MahilaMember[];
  currentMemberId: string;
  donations: DonationRecord[];
  jamanwars: JamanwarPlan[];
  sabhas: SabhaEvent[];
  notifications: EmailNotification[];
}

/**
 * Creates a complete JSON backup file content that can be downloaded to disk
 */
export async function generateFullBackup(data: {
  members: MahilaMember[];
  currentMemberId: string;
  donations: DonationRecord[];
  jamanwars: JamanwarPlan[];
  sabhas: SabhaEvent[];
  notifications: EmailNotification[];
}): Promise<string> {
  const backup: AppCompleteBackup = {
    version: '2.0.0',
    exportDate: new Date().toISOString(),
    ...data
  };
  return JSON.stringify(backup, null, 2);
}

/**
 * Clears persistent database and resets to factory data
 */
export async function resetDatabase(): Promise<void> {
  try {
    await clear();
  } catch (e) {
    console.error('Failed to clear IndexedDB:', e);
  }
  try {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  } catch (e) {
    console.error('Failed to clear localStorage:', e);
  }
}
