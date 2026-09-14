"use client";

import { useState } from "react";
import { logoutAction } from "@/lib/actions";
import { Spinner } from "./Spinner";
import { BusyOverlay } from "./BusyOverlay";

export function LogoutButton() {
  const [pending, setPending] = useState(false);

  return (
    <>
      <BusyOverlay show={pending} label="Déconnexion..." />
      <form
        action={async () => {
          setPending(true);
          await logoutAction();
        }}
      >
        <button className="btn btn-ghost" type="submit" disabled={pending}>
          {pending ? <><Spinner /> Déconnexion...</> : "Déconnexion"}
        </button>
      </form>
    </>
  );
}
