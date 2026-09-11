const ICONS: Record<string, string> = {
  orientation: "M12 2l2.2 6.6H21l-5.4 4 2.1 6.4L12 15.8 6.3 19l2.1-6.4L3 8.6h6.8z",
  programme: "M4 5h16v3H4zm0 6h10v3H4zm0 6h16v3H4z",
  dossier: "M4 6h7l2 2h7v12H4z",
  candidatures: "M5 4h14v16H5zm3 4h8M8 12h8M8 16h5",
  admission: "M12 3l8 4v6c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V7z",
  visa: "M4 6h16v12H4zm4 0v12m4-8h5",
  depart: "M3 12h12l6-4v8l-6-4H3z",
};

export function StepIcon({ code }: { code: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d={ICONS[code] ?? ICONS.dossier} />
    </svg>
  );
}
