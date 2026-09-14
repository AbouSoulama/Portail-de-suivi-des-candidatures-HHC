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

function assemble(users: User[], candidatRows: CandidatRow[], stepRows: StepRow[]): Database {
  const candidats: Candidat[] = candidatRows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    telephone: row.telephone,
    destination: row.destination,
    programme: row.programme,
    niveau: row.niveau,
    conseiller: row.conseiller,
    noteInterne: row.note_interne,
    createdAt: row.created_at,
    steps: stepRows
      .filter((step) => step.candidat_id === row.id)
      .sort((a, b) => a.position - b.position)
      .map((step) => ({
        id: step.id,
        code: step.code,
        label: step.label,
        status: step.status,
        commentaire: step.commentaire,
        updatedAt: step.updated_at,
      })),
  }));

  return { users, candidats };
}

async function readSupabase(): Promise<Database> {
  const supabase = getSupabase();
  const [usersRes, candidatsRes, stepsRes] = await Promise.all([
    supabase.from("users").select("*"),
    supabase.from("candidats").select("*"),
    supabase.from("steps").select("*"),
  ]);

  if (usersRes.error) throw usersRes.error;
  if (candidatsRes.error) throw candidatsRes.error;
  if (stepsRes.error) throw stepsRes.error;

  const users: User[] = (usersRes.data as UserRow[]).map((row) => ({
    id: row.id,
    identifiant: row.identifiant,
    passwordHash: row.password_hash,
    role: row.role,
    prenom: row.prenom,
    nom: row.nom,
  }));

  return assemble(users, (candidatsRes.data ?? []) as CandidatRow[], (stepsRes.data ?? []) as StepRow[]);
}

async function writeSupabase(db: Database) {
  const supabase = getSupabase();
  const userRows = db.users.map((user) => ({
    id: user.id,
    identifiant: user.identifiant,
    password_hash: user.passwordHash,
    role: user.role,
    prenom: user.prenom,
    nom: user.nom,
  }));
  const candidatRows = db.candidats.map((candidat) => ({
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
  const stepRows = db.candidats.flatMap((candidat) =>
    candidat.steps.map((step, position) => ({
      id: step.id,
      candidat_id: candidat.id,
      code: step.code,
      label: step.label,
      status: step.status,
      commentaire: step.commentaire,
      updated_at: step.updatedAt,
      position,
    }))
  );

  const [usersUpsert, candidatsUpsert, stepsUpsert] = await Promise.all([
    supabase.from("users").upsert(userRows),
    supabase.from("candidats").upsert(candidatRows),
    supabase.from("steps").upsert(stepRows),
  ]);
  if (usersUpsert.error) throw usersUpsert.error;
  if (candidatsUpsert.error) throw candidatsUpsert.error;
  if (stepsUpsert.error) throw stepsUpsert.error;

  const userIds = db.users.map((user) => user.id);
  const candidatIds = db.candidats.map((candidat) => candidat.id);
  const stepIds = stepRows.map((step) => step.id);

  if (userIds.length) {
    const extraUsers = await supabase.from("users").delete().not("id", "in", `(${userIds.join(",")})`);
    if (extraUsers.error) throw extraUsers.error;
  }
  if (candidatIds.length) {
    const extraCandidats = await supabase.from("candidats").delete().not("id", "in", `(${candidatIds.join(",")})`);
    if (extraCandidats.error) throw extraCandidats.error;
  }
  if (stepIds.length) {
    const extraSteps = await supabase.from("steps").delete().not("id", "in", `(${stepIds.join(",")})`);
    if (extraSteps.error) throw extraSteps.error;
  }
}

function readJson(): Database {
  if (!existsSync(DATA_FILE)) {
    return emptyDb();
  }
  const raw = readFileSync(DATA_FILE, "utf8");
  const parsed = JSON.parse(raw) as Database;
  return {
    users: parsed.users ?? [],
    candidats: parsed.candidats ?? [],
  };
}

function writeJson(db: Database) {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  const tmp = `${DATA_FILE}.tmp`;
  writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
  renameSync(tmp, DATA_FILE);
}

export async function readDb(): Promise<Database> {
  const db = hasSupabase() ? await readSupabase() : readJson();
  const changed = db.candidats.some((candidat) => syncCandidatSteps(candidat));
  if (changed) {
    await writeDb(db);
  }
  return db;
}

export async function writeDb(db: Database) {
  if (hasSupabase()) {
    await writeSupabase(db);
    return;
  }
  writeJson(db);
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
