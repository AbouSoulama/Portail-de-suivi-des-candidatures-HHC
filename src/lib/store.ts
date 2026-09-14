import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "fs";
import path from "path";
import { getSupabase, hasSupabase } from "./supabase";
import { syncCandidatSteps } from "./steps";
import type { Candidat, Database, Step, User } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "portail.json");

function emptyDb(): Database {
  return { users: [], candidats: [] };
}

type UserRow = {
  id: string;
  identifiant: string;
  password_hash: string;
  role: User["role"];
  prenom: string;
  nom: string;
};

type CandidatRow = {
  id: string;
  user_id: string;
  telephone: string;
  destination: string;
  programme: string;
  niveau: string;
  conseiller: string;
  note_interne: string;
  created_at: string;
};

type StepRow = {
  id: string;
  candidat_id: string;
  code: string;
  label: string;
  status: Step["status"];
  commentaire: string;
  updated_at: string;
  position: number;
};

function mapUser(row: UserRow): User {
  return {
    id: row.id,
    identifiant: row.identifiant,
    passwordHash: row.password_hash,
    role: row.role,
    prenom: row.prenom,
    nom: row.nom,
  };
}

function mapCandidat(row: CandidatRow, stepRows: StepRow[]): Candidat {
  return {
    id: row.id,
    userId: row.user_id,
    telephone: row.telephone ?? "",
    destination: row.destination ?? "",
    programme: row.programme ?? "",
    niveau: row.niveau ?? "",
    conseiller: row.conseiller ?? "",
    noteInterne: row.note_interne ?? "",
    createdAt: row.created_at,
    steps: stepRows
      .filter((step) => step.candidat_id === row.id)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((step) => ({
        id: step.id,
        code: step.code,
        label: step.label,
        status: step.status,
        commentaire: step.commentaire ?? "",
        updatedAt: step.updated_at,
      })),
  };
}

function stepRowsOf(candidat: Candidat): StepRow[] {
  return candidat.steps.map((step, position) => ({
    id: step.id,
    candidat_id: candidat.id,
    code: step.code,
    label: step.label,
    status: step.status,
    commentaire: step.commentaire,
    updated_at: step.updatedAt,
    position,
  }));
}

async function persistMissingSteps(candidats: Candidat[]) {
  if (!hasSupabase()) return;
  const rows = candidats.flatMap(stepRowsOf);
  if (!rows.length) return;
  const { error } = await getSupabase().from("steps").upsert(rows, { onConflict: "id" });
  if (error) throw error;
}

async function readSupabase(): Promise<Database> {
  const supabase = getSupabase();
  const [usersRes, candidatsRes, stepsRes] = await Promise.all([
    supabase.from("users").select("*"),
    supabase.from("candidats").select("*"),
    supabase.from("steps").select("*"),
  ]);

  if (usersRes.error) throw new Error(`Supabase users: ${usersRes.error.message}`);
  if (candidatsRes.error) throw new Error(`Supabase candidats: ${candidatsRes.error.message}`);
  if (stepsRes.error) throw new Error(`Supabase steps: ${stepsRes.error.message}`);

  const stepRows = (stepsRes.data ?? []) as StepRow[];
  const users = ((usersRes.data ?? []) as UserRow[]).map(mapUser);
  const candidats = ((candidatsRes.data ?? []) as CandidatRow[]).map((row) => mapCandidat(row, stepRows));
  return { users, candidats };
}

function readJson(): Database {
  if (!existsSync(DATA_FILE)) return emptyDb();
  const parsed = JSON.parse(readFileSync(DATA_FILE, "utf8")) as Database;
  return { users: parsed.users ?? [], candidats: parsed.candidats ?? [] };
}

function writeJson(db: Database) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  const tmp = `${DATA_FILE}.tmp`;
  writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
  renameSync(tmp, DATA_FILE);
}

export async function readDb(): Promise<Database> {
  const db = hasSupabase() ? await readSupabase() : readJson();
  const changed = db.candidats.filter((candidat) => syncCandidatSteps(candidat));
  if (changed.length) {
    if (hasSupabase()) {
      await persistMissingSteps(changed);
    } else {
      writeJson(db);
    }
  }
  return db;
}

export async function writeDb(db: Database) {
  if (!hasSupabase()) {
    writeJson(db);
    return;
  }

  const supabase = getSupabase();
  const users = db.users.map((user) => ({
    id: user.id,
    identifiant: user.identifiant,
    password_hash: user.passwordHash,
    role: user.role,
    prenom: user.prenom,
    nom: user.nom,
  }));
  const candidats = db.candidats.map((candidat) => ({
    id: candidat.id,
    user_id: candidat.userId,
    telephone: candidat.telephone,
    destination: candidat.destination,
    programme: candidat.programme,
    niveau: candidat.niveau,
    conseiller: candidat.conseiller,
    note_interne: candidat.noteInterne,
    created_at: candidat.createdAt,
  }));
  const steps = db.candidats.flatMap(stepRowsOf);

  if (users.length) {
    const { error } = await supabase.from("users").upsert(users, { onConflict: "id" });
    if (error) throw new Error(`Supabase users upsert: ${error.message}`);
  }
  if (candidats.length) {
    const { error } = await supabase.from("candidats").upsert(candidats, { onConflict: "id" });
    if (error) throw new Error(`Supabase candidats upsert: ${error.message}`);
  }
  if (steps.length) {
    const { error } = await supabase.from("steps").upsert(steps, { onConflict: "id" });
    if (error) throw new Error(`Supabase steps upsert: ${error.message}`);
  }
}

export async function updateStepRecord(stepId: string, status: Step["status"], commentaire: string) {
  const updatedAt = new Date().toISOString();
  if (hasSupabase()) {
    const { data, error } = await getSupabase()
      .from("steps")
      .update({ status, commentaire, updated_at: updatedAt })
      .eq("id", stepId)
      .select("id")
      .maybeSingle();
    if (error) throw new Error(`Supabase step update: ${error.message}`);
    if (!data) return false;
    return true;
  }

  const db = readJson();
  for (const candidat of db.candidats) {
    const step = candidat.steps.find((item) => item.id === stepId);
    if (!step) continue;
    step.status = status;
    step.commentaire = commentaire;
    step.updatedAt = updatedAt;
    writeJson(db);
    return true;
  }
  return false;
}

export async function isDbReady() {
  const db = await readDb();
  return db.users.some((user) => user.role === "admin");
}

export async function ensureDefaultAdmins() {
  if (await isDbReady()) return;
  const { hashPassword, generateId } = await import("./auth");
  const db = await readDb();
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
      passwordHash: await hashPassword(process.env.CONSEILLER_PASSWORD || process.env.ADMIN_PASSWORD || "Conseil2026!"),
      role: "admin",
      prenom: "Conseiller",
      nom: "Hamine Happy",
    }
  );
  await writeDb(db);
}
