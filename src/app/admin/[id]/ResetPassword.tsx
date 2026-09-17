"use client";

import { useState } from "react";
import { resetPasswordAction } from "@/lib/actions";
import { FormBusy, SubmitButton } from "@/components/FormBusy";
import { PasswordAssignFields } from "@/components/PasswordAssignFields";

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
      <FormBusy label="Mise à jour du mot de passe..." />
      <input type="hidden" name="userId" value={userId} />
      {error && <div className="error">{error}</div>}
      {result && (
        <div className="creds" style={{ marginBottom: 12 }}>
          <div>Nouveau mot de passe pour {result.identifiant}</div>
          <code>{result.password}</code>
        </div>
      )}
      <PasswordAssignFields />
      <SubmitButton className="btn btn-light" pendingLabel="Enregistrement..." dark>
        Enregistrer le mot de passe
      </SubmitButton>
    </form>
  );
}
