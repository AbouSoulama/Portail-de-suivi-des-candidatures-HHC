import { logoutAction } from "@/lib/actions";
import type { SessionUser } from "@/lib/types";
import { Brand } from "./Brand";

export function Topbar({ user }: { user: SessionUser }) {
  return (
    <header className="topbar">
      <Brand />
      <div className="topbar-actions">
        <div className="who">
          <small>{user.role === "admin" ? "Conseiller" : "Candidat"}</small>
          <b>{user.prenom} {user.nom}</b>
        </div>
        <form action={logoutAction}>
          <button className="btn btn-ghost" type="submit">
            Déconnexion
          </button>
        </form>
      </div>
    </header>
  );
}
