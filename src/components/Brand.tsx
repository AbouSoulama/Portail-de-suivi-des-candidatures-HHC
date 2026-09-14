export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <a className="brand" href="https://haminehappy.fr" title="Retour au site Hamine Happy">
      <img src="/logo.png" alt="Hamine Happy Consulting" />
      <div>
        <div className="brand-name">Hamine Happy</div>
        {!compact && <div className="brand-sub">Espace candidat</div>}
      </div>
    </a>
  );
}
