import type { SessionUser } from "@/lib/types";
import { initials } from "@/lib/ui";
import { Brand } from "./Brand";
import { LogoutButton } from "./LogoutButton";

export function Topbar({ user }: { user: SessionUser }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Brand />
        <div className="topbar-actions">
          <div className="who">
            <div className="avatar who-avatar">{initials(`${user.prenom} ${user.nom}`)}</div>
            <div className="who-copy">
              <small>{user.role === "admin" ? "Conseiller" : "Candidat"}</small>
              <b>{user.prenom} {user.nom}</b>
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
