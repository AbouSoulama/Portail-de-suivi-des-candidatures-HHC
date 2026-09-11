const FLAGS: Record<string, string> = {
  france: "🇫🇷",
  canada: "🇨🇦",
  chine: "🇨🇳",
  "états-unis": "🇺🇸",
  "etats-unis": "🇺🇸",
  usa: "🇺🇸",
  suisse: "🇨🇭",
  luxembourg: "🇱🇺",
  belgique: "🇧🇪",
  maroc: "🇲🇦",
  turquie: "🇹🇷",
  sénégal: "🇸🇳",
  senegal: "🇸🇳",
};

export function destinationFlag(name: string) {
  const key = name.trim().toLowerCase();
  return FLAGS[key] ?? "🌍";
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
