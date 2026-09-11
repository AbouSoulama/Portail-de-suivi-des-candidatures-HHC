export function ProgressRing({
  percent,
  label = "validé",
  tone = "light",
}: {
  percent: number;
  label?: string;
  tone?: "light" | "dark";
}) {
  const size = 118;
  const stroke = 9;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (Math.min(100, Math.max(0, percent)) / 100) * circ;
  const track = tone === "dark" ? "rgba(255,255,255,0.16)" : "#e8e2d6";
  const text = tone === "dark" ? "#fff" : "var(--ink)";
  const sub = tone === "dark" ? "rgba(255,255,255,0.65)" : "var(--muted)";

  return (
    <div className="ring">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#hhc-ring)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <defs>
          <linearGradient id="hhc-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c41a2e" />
            <stop offset="100%" stopColor="#e8b84a" />
          </linearGradient>
        </defs>
      </svg>
      <div className="ring-label">
        <b style={{ color: text }}>{percent}%</b>
        <span style={{ color: sub }}>{label}</span>
      </div>
    </div>
  );
}
