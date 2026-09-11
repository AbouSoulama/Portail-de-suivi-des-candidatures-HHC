"use client";

import { useState } from "react";
import { loginAction } from "@/lib/actions";

export function LoginForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [show, setShow] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError("");
    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <form action={onSubmit}>
      {error && <div className="error">{error}</div>}
      <label className="field">
        <span>Identifiant</span>
        <input name="identifiant" autoComplete="username" placeholder="prenom.nom" required />
      </label>
      <label className="field">
        <span>Mot de passe</span>
        <div className="password-box">
          <input
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
          <button className="password-toggle" type="button" onClick={() => setShow((value) => !value)}>
            {show ? "Masquer" : "Voir"}
          </button>
        </div>
      </label>
      <button className="btn btn-primary btn-full" type="submit" disabled={pending}>
        {pending ? "Connexion..." : "Entrer dans mon espace"}
      </button>
    </form>
  );
}
