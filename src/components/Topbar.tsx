import type { SessionUser } from "@/lib/types";
import { Brand } from "./Brand";
import { LogoutButton } from "./LogoutButton";

export function Topbar({ user }: { user: SessionUser }) {
  return (
    <header className="topbar">
      <Brand />
      <div className="topbar-actions">
        <div className="who">
          <small>{user.role === "admin" ? "Conseiller" : "Candidat"}</small>
          <b>{user.prenom} {user.nom}</b>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}
