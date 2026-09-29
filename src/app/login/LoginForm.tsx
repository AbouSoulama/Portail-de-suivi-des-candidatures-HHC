"use client";

import { useState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/actions";
import { FormBusy, SubmitButton } from "@/components/FormBusy";

export function LoginForm() {
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  async function onSubmit(formData: FormData) {
    setError("");
    const result = await loginAction(formData);
    if (result?.error) setError(result.error);
  }

  return (
    <form action={onSubmit}>
      <FormBusy label="Connexion en cours..." />
      {error && <div className="error">{error}</div>}
      <label className="field">
        <span>Identifiant</span>
        <input name="identifiant" autoComplete="username" placeholder="ex:ZY2610075" required />
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
      <SubmitButton className="btn btn-primary btn-full" pendingLabel="Connexion...">
        Entrer dans mon espace
      </SubmitButton>
      <p className="login-extra">
        <Link href="/login/mot-de-passe-oublie">Mot de passe oublié ?</Link>
      </p>
    </form>
  );
}
