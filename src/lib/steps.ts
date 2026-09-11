import { generateId } from "./auth";
import { STEP_TEMPLATES, type Candidat, type Step, type StepStatus } from "./types";

export function syncCandidatSteps(candidat: Candidat): boolean {
  let changed = false;
  const now = new Date().toISOString();

  for (const step of candidat.steps) {
    const template = STEP_TEMPLATES.find((item) => item.code === step.code);
    if (template && step.label !== template.label) {
      step.label = template.label;
      changed = true;
    }
  }

  if (!candidat.steps.some((step) => step.code === "admission")) {
    const admission: Step = {
      id: generateId(),
      code: "admission",
      label: "Admission",
      status: "a_faire",
      commentaire: "",
      updatedAt: now,
    };
    const visaIndex = candidat.steps.findIndex((step) => step.code === "visa");
    if (visaIndex >= 0) {
      candidat.steps.splice(visaIndex, 0, admission);
    } else {
      candidat.steps.push(admission);
    }
    changed = true;
  }

  return changed;
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
  const done = candidat.steps.filter((step) => step.status === "valide").length;
  return {
    done,
    total: candidat.steps.length,
    percent: Math.round((done / candidat.steps.length) * 100),
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
  if (candidat.steps.every((step) => step.status === "valide")) return "valide";
  if (candidat.steps.some((step) => step.status === "bloque")) return "bloque";
  if (candidat.steps.some((step) => step.status === "en_cours")) return "en_cours";
  return "a_faire";
}
