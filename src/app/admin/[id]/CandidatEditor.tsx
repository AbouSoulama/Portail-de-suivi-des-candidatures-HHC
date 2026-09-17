"use client";

import { useState } from "react";
import { updateCandidatAction } from "@/lib/actions";
import { FormBusy, SubmitButton } from "@/components/FormBusy";

type Props = {
  candidat: {
    id: string;
    prenom: string;
    nom: string;
    identifiant: string;
    telephone: string;
    destination: string;
    programme: string;
    niveau: string;
    conseiller: string;
    noteInterne: string;
  };
};

export function CandidatEditor({ candidat }: Props) {
  const [message, setMessage] = useState("");

  async function onSubmit(formData: FormData) {
    const result = await updateCandidatAction(formData);
    setMessage(result?.error ?? "Fiche enregistrée.");
  }

  return (
    <form action={onSubmit}>
      <FormBusy label="Enregistrement..." />
      <input type="hidden" name="id" value={candidat.id} />
      {message && <div className={message.includes("enregistr") ? "success" : "error"}>{message}</div>}
      <div className="two">
        <label className="field">
          <span>Prénom</span>
          <input name="prenom" defaultValue={candidat.prenom} />
        </label>
        <label className="field">
          <span>Nom</span>
          <input name="nom" defaultValue={candidat.nom} />
        </label>
      </div>
      <label className="field">
        <span>Identifiant</span>
        <input name="identifiant" defaultValue={candidat.identifiant} placeholder="ex:ZY2610075" required />
      </label>
      <label className="field">
        <span>Téléphone</span>
        <input name="telephone" defaultValue={candidat.telephone} />
      </label>
      <label className="field">
        <span>Destination</span>
        <input name="destination" defaultValue={candidat.destination} />
      </label>
      <label className="field">
        <span>Programme</span>
        <input name="programme" defaultValue={candidat.programme} />
      </label>
      <label className="field">
        <span>Niveau</span>
        <input name="niveau" defaultValue={candidat.niveau} />
      </label>
      <label className="field">
        <span>Conseiller</span>
        <input name="conseiller" defaultValue={candidat.conseiller} />
      </label>
      <label className="field">
        <span>Note interne (invisible pour le candidat)</span>
        <textarea name="noteInterne" defaultValue={candidat.noteInterne} />
      </label>
      <SubmitButton className="btn btn-primary" pendingLabel="Enregistrement...">
        Enregistrer la fiche
      </SubmitButton>
    </form>
  );
}
