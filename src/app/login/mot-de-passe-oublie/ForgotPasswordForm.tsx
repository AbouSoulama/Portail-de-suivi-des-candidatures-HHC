"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/lib/actions";
import { FormBusy, SubmitButton } from "@/components/FormBusy";

export function ForgotPasswordForm() {
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [show, setShow] = useState(false);

  async function onSubmit(formData: FormData) {
    setError("");
    const result = await forgotPasswordAction(formData);
    if (result?.error) {
      setError(result.error);
      return;
    }
    if (result?.success) setDone(true);
  }

  if (done) {
    return (
      <div>
        <div className="success">Votre mot de passe a été modifié. Vous pouvez vous connecter.</div>
        <Link className="btn btn-primary btn-full" href="/login">
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <form action={onSubmit}>
      <FormBusy label="Mise à jour du mot de passe..." />
      {error && <div className="error">{error}</div>}
      <label className="field">
        <span>Identifiant</span>
        <input name="identifiant" autoComplete="username" placeholder="ex:ZY2610075" required />
      </label>
      <div className="two">
        <label className="field">
          <span>Prénom</span>
          <input name="prenom" autoComplete="given-name" required />
        </label>
        <label className="field">
          <span>Nom</span>
          <input name="nom" autoComplete="family-name" required />
        </label>
      </div>
      <label className="field">
        <span>Téléphone (candidats)</span>
        <input name="telephone" autoComplete="tel" placeholder="Le numéro enregistré sur votre dossier" />
      </label>
      <p className="field-hint">Les conseillers laissent le téléphone vide. Les candidats doivent indiquer le numéro de leur fiche.</p>
      <label className="field">
        <span>Nouveau mot de passe</span>
        <div className="password-box">
          <input
            name="password"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            minLength={6}
            required
          />
          <button className="password-toggle" type="button" onClick={() => setShow((value) => !value)}>
            {show ? "Masquer" : "Voir"}
          </button>
        </div>
      </label>
      <label className="field">
        <span>Confirmer le mot de passe</span>
        <input name="confirmation" type={show ? "text" : "password"} autoComplete="new-password" minLength={6} required />
      </label>
      <SubmitButton className="btn btn-primary btn-full" pendingLabel="Enregistrement...">
        Changer mon mot de passe
      </SubmitButton>
      <p className="login-extra">
        <Link href="/login">Retour à la connexion</Link>
      </p>
    </form>
  );
}
