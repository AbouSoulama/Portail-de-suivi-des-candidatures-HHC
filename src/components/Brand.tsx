import { SiteHomeLink } from "./SiteHomeLink";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <SiteHomeLink className="brand">
      <img src="/logo.png" alt="Hamine Happy Consulting" />
      <div>
        <div className="brand-name">Hamine Happy</div>
        {!compact && <div className="brand-sub">Espace candidat</div>}
      </div>
    </SiteHomeLink>
  );
}
