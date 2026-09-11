"use client";

import { useState } from "react";
import { resetPasswordAction } from "@/lib/actions";

export function ResetPassword({ userId }: { userId: string }) {
  const [result, setResult] = useState<{ identifiant: string; password: string } | null>(null);
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    setError("");
    const response = await resetPasswordAction(formData);
    if (response?.error) {
      setError(response.error);
      return;
    }
    if (response?.success) {
      setResult({ identifiant: response.identifiant, password: response.password });
    }
  }

  return (
    <form action={onSubmit}>
      <input type="hidden" name="userId" value={userId} />
      {error && <div className="error">{error}</div>}
      {result && (
        <div className="creds" style={{ marginBottom: 12 }}>
          <div>Nouveau mot de passe pour {result.identifiant}</div>
          <code>{result.password}</code>
        </div>
      )}
      <button className="btn btn-light" type="submit">Générer un nouveau mot de passe</button>
    </form>
  );
}
