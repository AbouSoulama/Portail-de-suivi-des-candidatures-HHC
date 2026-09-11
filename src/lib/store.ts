import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "fs";
import path from "path";
import { syncCandidatSteps } from "./steps";
import type { Database } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "portail.json");

function emptyDb(): Database {
  return { users: [], candidats: [] };
}

export function readDb(): Database {
  if (!existsSync(DATA_FILE)) {
    return emptyDb();
  }
  const raw = readFileSync(DATA_FILE, "utf8");
  const parsed = JSON.parse(raw) as Database;
  const db: Database = {
    users: parsed.users ?? [],
    candidats: parsed.candidats ?? [],
  };
  const changed = db.candidats.some((candidat) => syncCandidatSteps(candidat));
  if (changed) {
    writeDb(db);
  }
  return db;
}

export function writeDb(db: Database): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  const tmp = `${DATA_FILE}.tmp`;
  writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
  renameSync(tmp, DATA_FILE);
}

export function isDbReady(): boolean {
  if (!existsSync(DATA_FILE)) return false;
  const db = readDb();
  return db.users.some((user) => user.role === "admin");
}

export async function ensureDefaultAdmins() {
  if (isDbReady()) return;
  const { hashPassword, generateId } = await import("./auth");
  const db = readDb();
  db.users.push(
    {
      id: generateId(),
      identifiant: "hamine",
      passwordHash: await hashPassword(process.env.ADMIN_PASSWORD || "Hamine2026!"),
      role: "admin",
      prenom: "Hamine",
      nom: "Ouedraogo",
    },
    {
      id: generateId(),
      identifiant: "conseiller",
      passwordHash: await hashPassword(process.env.ADMIN_PASSWORD || "Conseil2026!"),
      role: "admin",
      prenom: "Conseiller",
      nom: "Hamine Happy",
    }
  );
  writeDb(db);
}
