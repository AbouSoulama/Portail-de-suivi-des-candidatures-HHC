import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import type { Candidat, Database, Step, User } from "../src/lib/types";
import { STEP_TEMPLATES } from "../src/lib/types";

function steps(overrides: Partial<Record<string, Pick<Step, "status" | "commentaire">>> = {}): Step[] {
  const now = new Date().toISOString();
  return STEP_TEMPLATES.map((template, index) => ({
    id: randomUUID(),
    code: template.code,
    label: template.label,
    status: overrides[template.code]?.status ?? (index === 0 ? "en_cours" : "a_faire"),
    commentaire: overrides[template.code]?.commentaire ?? "",
    updatedAt: now,
  }));
}

async function user(
  identifiant: string,
  password: string,
  role: User["role"],
  prenom: string,
  nom: string
): Promise<User> {
  return {
    id: randomUUID(),
    identifiant,
    passwordHash: await bcrypt.hash(password, 10),
    role,
    prenom,
    nom,
  };
}

async function main() {
  const hamine = await user("hamine", "Hamine2026!", "admin", "Hamine", "Ouedraogo");
  const collegue = await user("conseiller", "Conseil2026!", "admin", "Conseiller", "Hamine Happy");

  const aissataUser = await user("aissata.sawadogo", "Demo2026!", "candidat", "Aïssata", "Sawadogo");
  const ibrahimUser = await user("ibrahim.kabore", "Demo2026!", "candidat", "Ibrahim", "Kaboré");
  const fatouUser = await user("fatou.traore", "Demo2026!", "candidat", "Fatou", "Traoré");

  const candidats: Candidat[] = [
    {
      id: randomUUID(),
      userId: aissataUser.id,
      telephone: "+226 70 00 00 01",
      destination: "France",
      programme: "Master Marketing Digital — Université de Lyon",
      niveau: "Master",
      conseiller: "Hamine Ouedraogo",
      noteInterne: "Dossier solide. Relancer pour le relevé L3.",
      createdAt: new Date().toISOString(),
      steps: steps({
        orientation: { status: "valide", commentaire: "Profil orienté vers un Master marketing en France." },
        programme: { status: "valide", commentaire: "3 formations retenues, priorité Lyon." },
        dossier: {
          status: "en_cours",
          commentaire: "CV et lettre OK. Il manque le relevé de notes de Licence 3.",
        },
      }),
    },
    {
      id: randomUUID(),
      userId: ibrahimUser.id,
      telephone: "+226 70 00 00 02",
      destination: "Canada",
      programme: "Licence Informatique — Université d'Ottawa",
      niveau: "Licence",
      conseiller: "Conseiller Hamine Happy",
      noteInterne: "Attendre le passeport renouvelé.",
      createdAt: new Date().toISOString(),
      steps: steps({
        orientation: { status: "valide", commentaire: "Canada retenu, filière informatique." },
        programme: { status: "en_cours", commentaire: "Comparaison Ottawa / Montréal en cours." },
      }),
    },
    {
      id: randomUUID(),
      userId: fatouUser.id,
      telephone: "+226 70 00 00 03",
      destination: "Chine",
      programme: "Bourse CSC — Génie civil",
      niveau: "Master",
      conseiller: "Hamine Ouedraogo",
      noteInterne: "",
      createdAt: new Date().toISOString(),
      steps: steps({
        orientation: {
          status: "bloque",
          commentaire: "En attente du certificat de langue (HSK ou anglais).",
        },
      }),
    },
  ];

  const db: Database = {
    users: [hamine, collegue, aissataUser, ibrahimUser, fatouUser],
    candidats,
  };

  const dir = path.join(process.cwd(), "data");
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "portail.json"), JSON.stringify(db, null, 2), "utf8");

  console.log("Base initialisée : data/portail.json");
  console.log("");
  console.log("Conseillers");
  console.log("  hamine / Hamine2026!");
  console.log("  conseiller / Conseil2026!");
  console.log("");
  console.log("Candidats démo");
  console.log("  aissata.sawadogo / Demo2026!");
  console.log("  ibrahim.kabore / Demo2026!");
  console.log("  fatou.traore / Demo2026!");
}

main();
