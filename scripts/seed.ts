import { existsSync, readFileSync } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { replaceDb } from "../src/lib/store";
import { STAFF_ACCOUNTS } from "../src/lib/staff";
import type { Database, User } from "../src/lib/types";

function loadEnv() {
  const file = path.join(process.cwd(), ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

async function user(account: (typeof STAFF_ACCOUNTS)[number]): Promise<User> {
  return {
    id: randomUUID(),
    identifiant: account.identifiant,
    passwordHash: await bcrypt.hash(account.password, 10),
    role: "admin",
    prenom: account.prenom,
    nom: account.nom,
  };
}

async function main() {
  loadEnv();
  const db: Database = {
    users: await Promise.all(STAFF_ACCOUNTS.map(user)),
    candidats: [],
  };
  await replaceDb(db);
  console.log("Anciens candidats et conseillers supprimés.");
  console.log("2 conseillers créés :");
  for (const account of STAFF_ACCOUNTS) {
    console.log(`  ${account.identifiant} — ${account.prenom} ${account.nom}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
