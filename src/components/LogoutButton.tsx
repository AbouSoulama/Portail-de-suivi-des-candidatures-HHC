"use client";

import { logoutAction } from "@/lib/actions";
import { FormBusy, SubmitButton } from "@/components/FormBusy";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <FormBusy label="Déconnexion..." />
      <SubmitButton className="btn btn-ghost" pendingLabel="Déconnexion...">
        Déconnexion
      </SubmitButton>
    </form>
  );
}
