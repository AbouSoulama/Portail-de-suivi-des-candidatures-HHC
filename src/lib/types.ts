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
  { code: "depart", label: "Départ" },
  { code: "accompagnement", label: "Accompagnement" },
];

export const STATUS_LABELS: Record<StepStatus, string> = {
  a_faire: "À venir",
  en_cours: "En cours",
  valide: "Validé",
  bloque: "En attente",
};

export function statusOptions(code?: string): { value: StepStatus; label: string }[] {
  if (code === "admission") {
    return [
      { value: "a_faire", label: "À venir" },
      { value: "en_cours", label: "En cours" },
      { value: "valide", label: "Obtenue" },
    ];
  }
  if (code === "visa") {
    return [
      { value: "en_cours", label: "Visa en cours de préparation" },
      { value: "a_faire", label: "Démarche pour le visa" },
      { value: "valide", label: "Visa obtenu" },
      { value: "bloque", label: "Visa refusé" },
    ];
  }
  if (code === "depart") {
    return [
      { value: "en_cours", label: "En cours de préparation" },
      { value: "bloque", label: "Prêt pour le départ" },
      { value: "valide", label: "Étudiant installé" },
    ];
  }
  if (code === "accompagnement") {
    return [
      { value: "en_cours", label: "En cours" },
      { value: "valide", label: "Finaliser" },
    ];
  }
  return [
    { value: "a_faire", label: "À venir" },
    { value: "en_cours", label: "En cours" },
    { value: "valide", label: "Validé" },
    { value: "bloque", label: "En attente" },
  ];
}

export function statusLabel(status: StepStatus, code?: string) {
  const match = statusOptions(code).find((option) => option.value === status);
  if (match) return match.label;
  return STATUS_LABELS[status];
}

export function statusBadgeClass(status: StepStatus, code?: string) {
  if (code === "visa" && status === "bloque") return "refuse";
  if (code === "depart" && status === "bloque") return "ready";
  return status;
}
