export type Role = "admin" | "candidat";

export type StepStatus = "a_faire" | "en_cours" | "valide" | "bloque";

export type User = {
  id: string;
  identifiant: string;
  passwordHash: string;
  role: Role;
  prenom: string;
  nom: string;
};

export type Step = {
  id: string;
  code: string;
  label: string;
  status: StepStatus;
  commentaire: string;
  updatedAt: string;
};

export type Candidat = {
  id: string;
  userId: string;
  telephone: string;
  destination: string;
  programme: string;
  niveau: string;
  conseiller: string;
  noteInterne: string;
  createdAt: string;
  steps: Step[];
};

export type SessionUser = {
  id: string;
  identifiant: string;
  role: Role;
  prenom: string;
  nom: string;
};

export type Database = {
  users: User[];
  candidats: Candidat[];
};

export const STEP_TEMPLATES: { code: string; label: string }[] = [
  { code: "orientation", label: "Orientation académique" },
  { code: "programme", label: "Choix du programme" },
  { code: "dossier", label: "Préparation du dossier" },
  { code: "candidatures", label: "Candidatures & demande admissions" },
  { code: "admission", label: "Admission" },
  { code: "visa", label: "Visa étudiant" },
  { code: "depart", label: "Préparation au départ" },
];

export const STATUS_LABELS: Record<StepStatus, string> = {
  a_faire: "À faire",
  en_cours: "En cours",
  valide: "Validé",
  bloque: "En attente",
};

export function statusLabel(status: StepStatus, code?: string) {
  if (code === "admission" && status === "valide") return "Obtenue";
  return STATUS_LABELS[status];
}
