"use client";

import { useState } from "react";
import { resetPasswordAction } from "@/lib/actions";
import { Spinner } from "@/components/Spinner";
import { BusyOverlay } from "@/components/BusyOverlay";

export function ResetPassword({ userId }: { userId: string }) {
  const [result, setResult] = useState<{ identifiant: string; password: string } | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError("");
    const response = await resetPasswordAction(formData);
    if (response?.error) {
      setError(response.error);
      setPending(false);
      return;
    }
    if (response?.success) {
      setResult({ identifiant: response.identifiant, password: response.password });
    }
    setPending(false);
  }

  return (
    <form action={onSubmit}>
      <BusyOverlay show={pending} label="Génération du mot de passe..." />
      <input type="hidden" name="userId" value={userId} />
      {error && <div className="error">{error}</div>}
      {result && (
        <div className="creds" style={{ marginBottom: 12 }}>
          <div>Nouveau mot de passe pour {result.identifiant}</div>
          <code>{result.password}</code>
        </div>
      )}
      <button className="btn btn-light" type="submit" disabled={pending}>
        {pending ? <><Spinner dark /> Génération...</> : "Générer un nouveau mot de passe"}
      </button>
    </form>
  );
}
