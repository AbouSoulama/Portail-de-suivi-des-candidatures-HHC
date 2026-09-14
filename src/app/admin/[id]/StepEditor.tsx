"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateStepAction } from "@/lib/actions";
import { StatusBadge } from "@/components/StatusBadge";
import { StepIcon } from "@/components/StepIcon";
import type { Step } from "@/lib/types";

export function StepEditor({ candidatId, step }: { candidatId: string; step: Step }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    const result = await updateStepAction(formData);
    setMessage(result?.error ?? "Étape mise à jour.");
    setPending(false);
    if (!result?.error) router.refresh();
  }

  return (
    <form action={onSubmit} className="step-card" style={{ marginBottom: 12 }}>
      <input type="hidden" name="candidatId" value={candidatId} />
      <input type="hidden" name="stepId" value={step.id} />
      <div className="step-head" style={{ marginBottom: 10 }}>
        <div className="person">
          <div className={`dot ${step.status}`} style={{ width: 34, height: 34 }}>
            <StepIcon code={step.code} />
          </div>
          <strong>{step.label}</strong>
        </div>
        <StatusBadge status={step.status} code={step.code} />
      </div>
      {message && <div className={message.includes("mise à jour") ? "success" : "error"}>{message}</div>}
      <label className="field">
        <span>Statut</span>
        <select name="status" defaultValue={step.status === "bloque" && step.code === "admission" ? "a_faire" : step.status}>
          {step.code === "admission" ? (
            <>
              <option value="a_faire">À faire</option>
              <option value="en_cours">En cours</option>
              <option value="valide">Obtenue</option>
            </>
          ) : (
            <>
              <option value="a_faire">À faire</option>
              <option value="en_cours">En cours</option>
              <option value="valide">Validé</option>
              <option value="bloque">En attente</option>
            </>
          )}
        </select>
      </label>
      <label className="field">
        <span>Commentaire visible par le candidat</span>
        <textarea name="commentaire" defaultValue={step.commentaire} placeholder="Ex. CV validé. Il manque le relevé de notes." />
      </label>
      <button className="btn btn-light" type="submit" disabled={pending}>
        {pending ? "Enregistrement..." : "Mettre à jour cette étape"}
      </button>
    </form>
  );
}
