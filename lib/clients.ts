import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import bcrypt from "bcryptjs";

const DATA_DIR = join(process.cwd(), "data");
const FILE = join(DATA_DIR, "clients.json");

export interface ClientRecord {
  email: string;
  name: string;
  company?: string;
  passHash: string;
  wcCustomerId?: number;
  createdAt: string;
}

function load(): Record<string, ClientRecord> {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    if (!existsSync(FILE)) return {};
    return JSON.parse(readFileSync(FILE, "utf-8"));
  } catch {
    return {};
  }
}

function save(clients: Record<string, ClientRecord>): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(FILE, JSON.stringify(clients, null, 2));
}

export function getClientByEmail(email: string): ClientRecord | null {
  const clients = load();
  return clients[email.toLowerCase()] ?? null;
}

export function clientExists(email: string): boolean {
  return !!getClientByEmail(email);
}

export async function createClient(data: {
  email: string;
  name: string;
  company?: string;
  password: string;
  wcCustomerId?: number;
}): Promise<ClientRecord> {
  const clients = load();
  const passHash = await bcrypt.hash(data.password, 10);
  const record: ClientRecord = {
    email: data.email.toLowerCase(),
    name: data.name,
    company: data.company,
    passHash,
    wcCustomerId: data.wcCustomerId,
    createdAt: new Date().toISOString(),
  };
  clients[record.email] = record;
  save(clients);
  return record;
}

export async function validateClient(
  email: string,
  password: string
): Promise<ClientRecord | null> {
  const client = getClientByEmail(email);
  if (!client) return null;
  const valid = await bcrypt.compare(password, client.passHash);
  return valid ? client : null;
}

export function updateClientWCId(email: string, wcCustomerId: number): void {
  const clients = load();
  const key = email.toLowerCase();
  if (clients[key]) {
    clients[key].wcCustomerId = wcCustomerId;
    save(clients);
  }
}
