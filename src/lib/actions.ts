"use server";

import { redirect } from "next/navigation";
import {
  createSession,
  destroySession,
  generateId,
  generatePassword,
  getSession,
  hashPassword,
  verifyPassword,
} from "./auth";
import { ensureDefaultAdmins, isDbReady, readDb, updateStepRecord, writeDb } from "./store";
import { createDefaultSteps } from "./steps";
import type { StepStatus } from "./types";

function requireAdmin() {
  return getSession().then((session) => {
    if (!session || session.role !== "admin") {
      redirect("/login");
    }
    return session;
  });
}

export async function loginAction(formData: FormData) {
  const identifiant = String(formData.get("identifiant") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!identifiant || !password) {
    return { error: "Identifiant et mot de passe requis." };
  }

  await ensureDefaultAdmins();
  if (!(await isDbReady())) {
    return { error: "Le portail n’est pas encore initialisé." };
  }

  const db = await readDb();
  const user = db.users.find((item) => item.identifiant.toLowerCase() === identifiant.toLowerCase());
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Identifiant ou mot de passe incorrect." };
  }

  await createSession({
    id: user.id,
    identifiant: user.identifiant,
    role: user.role,
    prenom: user.prenom,
    nom: user.nom,
  });

  redirect(user.role === "admin" ? "/admin" : "/suivi");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

export async function createCandidatAction(formData: FormData) {
  await requireAdmin();

  const prenom = String(formData.get("prenom") ?? "").trim();
  const nom = String(formData.get("nom") ?? "").trim();
  const identifiant = String(formData.get("identifiant") ?? "").trim();
  const telephone = String(formData.get("telephone") ?? "").trim();
  const destination = String(formData.get("destination") ?? "").trim();
  const programme = String(formData.get("programme") ?? "").trim();
  const niveau = String(formData.get("niveau") ?? "").trim();
  const conseiller = String(formData.get("conseiller") ?? "").trim();
  const passwordMode = String(formData.get("passwordMode") ?? "auto");
  const passwordManual = String(formData.get("passwordManual") ?? "");

  if (!prenom || !nom || !identifiant) {
    return { error: "Prénom, nom et identifiant sont obligatoires." };
  }

  const password = passwordMode === "manual" ? passwordManual.trim() : generatePassword();
  if (passwordMode === "manual" && password.length < 6) {
    return { error: "Le mot de passe saisi doit contenir au moins 6 caractères." };
  }

  const db = await readDb();
  if (db.users.some((user) => user.identifiant.toLowerCase() === identifiant.toLowerCase())) {
    return { error: "Cet identifiant existe déjà." };
  }
  const userId = generateId();
  const candidatId = generateId();

  db.users.push({
    id: userId,
    identifiant,
    passwordHash: await hashPassword(password),
    role: "candidat",
    prenom,
    nom,
  });

  db.candidats.push({
    id: candidatId,
    userId,
    telephone,
    destination,
    programme,
    niveau,
    conseiller,
    noteInterne: "",
    createdAt: new Date().toISOString(),
    steps: createDefaultSteps(),
  });

  await writeDb(db);

  return {
    success: true,
    identifiant,
    password,
    candidatId,
  };
}

export async function updateCandidatAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const db = await readDb();
  const candidat = db.candidats.find((item) => item.id === id);
  if (!candidat) return { error: "Candidat introuvable." };

  const user = db.users.find((item) => item.id === candidat.userId);
  if (user) {
    user.prenom = String(formData.get("prenom") ?? user.prenom).trim();
    user.nom = String(formData.get("nom") ?? user.nom).trim();
    const identifiant = String(formData.get("identifiant") ?? user.identifiant).trim();
    if (!identifiant) return { error: "L’identifiant est obligatoire." };
    const taken = db.users.some(
      (item) => item.id !== user.id && item.identifiant.toLowerCase() === identifiant.toLowerCase(),
    );
    if (taken) return { error: "Cet identifiant existe déjà." };
    user.identifiant = identifiant;
  }

  candidat.telephone = String(formData.get("telephone") ?? "").trim();
  candidat.destination = String(formData.get("destination") ?? "").trim();
  candidat.programme = String(formData.get("programme") ?? "").trim();
  candidat.niveau = String(formData.get("niveau") ?? "").trim();
  candidat.conseiller = String(formData.get("conseiller") ?? "").trim();
  candidat.noteInterne = String(formData.get("noteInterne") ?? "").trim();

  await writeDb(db);
  return { success: true };
}

export async function updateStepAction(formData: FormData) {
  await requireAdmin();

  const candidatId = String(formData.get("candidatId") ?? "");
  const stepId = String(formData.get("stepId") ?? "");
  const status = String(formData.get("status") ?? "") as StepStatus;
  const commentaire = String(formData.get("commentaire") ?? "").trim();

  const allowed: StepStatus[] = ["a_faire", "en_cours", "valide", "bloque"];
  if (!allowed.includes(status)) {
    return { error: "Statut invalide." };
  }

  const db = await readDb();
  const candidat = db.candidats.find((item) => item.id === candidatId);
  const step = candidat?.steps.find((item) => item.id === stepId);
  if (!candidat || !step) return { error: "Étape introuvable." };

  try {
    const ok = await updateStepRecord(stepId, status, commentaire);
    if (!ok) return { error: "Impossible d’enregistrer cette étape." };
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erreur d’enregistrement." };
  }
}

export async function resetPasswordAction(formData: FormData) {
  await requireAdmin();

  const userId = String(formData.get("userId") ?? "");
  const db = await readDb();
  const user = db.users.find((item) => item.id === userId && item.role === "candidat");
  if (!user) return { error: "Candidat introuvable." };

  const passwordManual = String(formData.get("passwordManual") ?? "").trim();
  const passwordMode = String(formData.get("passwordMode") ?? "auto");
  const password = passwordMode === "manual" ? passwordManual : generatePassword();
  if (passwordMode === "manual" && password.length < 6) {
    return { error: "Le mot de passe saisi doit contenir au moins 6 caractères." };
  }
  user.passwordHash = await hashPassword(password);
  await writeDb(db);

  return { success: true, identifiant: user.identifiant, password };
}
