"use client";

import { useState } from "react";
import Link from "next/link";
import { createCandidatAction } from "@/lib/actions";

export function NewCandidatForm({ conseiller }: { conseiller: string }) {
  const [error, setError] = useState("");
  const [created, setCreated] = useState<{ identifiant: string; password: string; candidatId: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError("");
    const result = await createCandidatAction(formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
      return;
    }
    if (result?.success) {
      setCreated({
        identifiant: result.identifiant,
        password: result.password,
        candidatId: result.candidatId,
      });
    }
    setPending(false);
  }

  if (created) {
    return (
      <div>
        <div className="success">Le dossier a été créé. Copiez ces identifiants maintenant : le mot de passe ne sera plus affiché.</div>
        <div className="creds">
          <div>Identifiant</div>
          <code>{created.identifiant}</code>
          <div style={{ marginTop: 12 }}>Mot de passe</div>
          <code>{created.password}</code>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <Link className="btn btn-primary" href={`/admin/${created.candidatId}`}>
            Ouvrir le dossier
          </Link>
          <button className="btn btn-light" type="button" onClick={() => setCreated(null)}>
            Créer un autre candidat
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={onSubmit}>
      {error && <div className="error">{error}</div>}
      <div className="two">
        <label className="field">
          <span>Prénom</span>
          <input name="prenom" required />
        </label>
        <label className="field">
          <span>Nom</span>
          <input name="nom" required />
        </label>
      </div>
      <label className="field">
        <span>Identifiant de connexion</span>
        <input name="identifiant" placeholder="ex. aissata.sawadogo" required />
      </label>
      <div className="two">
        <label className="field">
          <span>Téléphone</span>
          <input name="telephone" placeholder="+226 ..." />
        </label>
        <label className="field">
          <span>Destination</span>
          <input name="destination" placeholder="France, Canada, Chine..." />
        </label>
      </div>
      <label className="field">
        <span>Programme / université</span>
        <input name="programme" placeholder="Master ..., Université ..." />
      </label>
      <div className="two">
        <label className="field">
          <span>Niveau</span>
          <select name="niveau" defaultValue="">
            <option value="">—</option>
            <option>Licence</option>
            <option>Master</option>
            <option>Doctorat</option>
            <option>Séjour linguistique</option>
            <option>Autre</option>
          </select>
        </label>
        <label className="field">
          <span>Conseiller</span>
          <input name="conseiller" defaultValue={conseiller} />
        </label>
      </div>
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "Création..." : "Créer le dossier"}
      </button>
    </form>
  );
}
