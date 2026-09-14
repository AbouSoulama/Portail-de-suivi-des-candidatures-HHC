import { generateId } from "./auth";
import { STEP_TEMPLATES, type Candidat, type Step, type StepStatus } from "./types";

export function syncCandidatSteps(candidat: Candidat): boolean {
  const existing = new Map(candidat.steps.map((step) => [step.code, step]));
  const now = new Date().toISOString();
  let changed = false;

  const next = STEP_TEMPLATES.map((template, index) => {
    const current = existing.get(template.code);
    if (current) {
      if (current.label !== template.label) {
        current.label = template.label;
        changed = true;
      }
      return current;
    }
    changed = true;
    return {
      id: generateId(),
      code: template.code,
      label: template.label,
      status: index === 0 ? "en_cours" : "a_faire",
      commentaire: "",
      updatedAt: now,
    } satisfies Step;
  });

  if (changed || next.length !== candidat.steps.length) {
    candidat.steps = next;
    return true;
  }
  return false;
}

export function createDefaultSteps(): Step[] {
  const now = new Date().toISOString();
  return STEP_TEMPLATES.map((template, index) => ({
    id: generateId(),
    code: template.code,
    label: template.label,
    status: index === 0 ? "en_cours" : "a_faire",
    commentaire: "",
    updatedAt: now,
  }));
}

export function progressOf(candidat: Candidat) {
  const total = Math.max(candidat.steps.length, 1);
  const done = candidat.steps.filter((step) => step.status === "valide").length;
  return {
    done,
    total: candidat.steps.length,
    percent: candidat.steps.length ? Math.round((done / total) * 100) : 0,
  };
}

export function currentStep(candidat: Candidat): Step | null {
  return (
    candidat.steps.find((step) => step.status === "bloque") ??
    candidat.steps.find((step) => step.status === "en_cours") ??
    candidat.steps.find((step) => step.status === "a_faire") ??
    candidat.steps[candidat.steps.length - 1] ??
    null
  );
}

export function globalStatus(candidat: Candidat): StepStatus {
  if (!candidat.steps.length) return "a_faire";
  if (candidat.steps.every((step) => step.status === "valide")) return "valide";
  if (candidat.steps.some((step) => step.status === "bloque")) return "bloque";
  if (candidat.steps.some((step) => step.status === "en_cours")) return "en_cours";
  return "a_faire";
}
