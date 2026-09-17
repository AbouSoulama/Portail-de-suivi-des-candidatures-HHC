"use client";

import { useState } from "react";

export function PasswordAssignFields({ defaultMode = "auto" }: { defaultMode?: "auto" | "manual" }) {
  const [mode, setMode] = useState<"auto" | "manual">(defaultMode);

  return (
    <div className="password-assign">
      <span className="field-label">Mot de passe</span>
      <div className="choice-row">
        <label className={`choice ${mode === "auto" ? "is-on" : ""}`}>
          <input type="radio" name="passwordMode" value="auto" checked={mode === "auto"} onChange={() => setMode("auto")} />
          Générer automatiquement
        </label>
        <label className={`choice ${mode === "manual" ? "is-on" : ""}`}>
          <input type="radio" name="passwordMode" value="manual" checked={mode === "manual"} onChange={() => setMode("manual")} />
          Saisir manuellement
        </label>
      </div>
      {mode === "manual" && (
        <label className="field" style={{ marginBottom: 0 }}>
          <span>Mot de passe attribué</span>
          <input name="passwordManual" type="text" minLength={6} required placeholder="Au moins 6 caractères" autoComplete="new-password" />
        </label>
      )}
    </div>
  );
}
