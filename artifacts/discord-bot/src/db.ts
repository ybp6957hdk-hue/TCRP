import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "economy.json");

export interface UserData {
  balance: number;
  inventory: string[];       // item IDs
  lastDaily: number | null;  // timestamp ms
}

interface DB {
  users: Record<string, UserData>;
}

function load(): DB {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) return { users: {} };
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8")) as DB;
}

function save(db: DB): void {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

export function getUser(userId: string): UserData {
  const db = load();
  if (!db.users[userId]) {
    db.users[userId] = { balance: 0, inventory: [], lastDaily: null };
    save(db);
  }
  return db.users[userId];
}

export function setUser(userId: string, data: UserData): void {
  const db = load();
  db.users[userId] = data;
  save(db);
}

export function addBalance(userId: string, amount: number): number {
  const user = getUser(userId);
  user.balance += amount;
  setUser(userId, user);
  return user.balance;
}

export function addItem(userId: string, itemId: string): void {
  const user = getUser(userId);
  user.inventory.push(itemId);
  setUser(userId, user);
}
