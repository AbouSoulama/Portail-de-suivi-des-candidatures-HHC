"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { destinationFlag, initials } from "@/lib/ui";
import type { StepStatus } from "@/lib/types";

type Row = {
  id: string;
  nomComplet: string;
  identifiant: string;
  destination: string;
  programme: string;
  conseiller: string;
  percent: number;
  done: number;
  total: number;
  currentLabel: string;
  global: StepStatus;
};

const FILTERS: { id: "all" | StepStatus; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "en_cours", label: "En cours" },
  { id: "bloque", label: "En attente" },
  { id: "valide", label: "Terminés" },
];

export function AdminSearch({ rows }: { rows: Row[] }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((row) => {
      const matchFilter = filter === "all" || row.global === filter;
      const matchText = [row.nomComplet, row.identifiant, row.destination, row.programme, row.conseiller]
        .join(" ")
        .toLowerCase()
        .includes(needle);
      return matchFilter && matchText;
    });
  }, [q, rows, filter]);

  return (
    <div>
      <div className="toolbar">
        <input
          className="search"
          placeholder="Rechercher un candidat, un pays, un programme..."
          value={q}
          onChange={(event) => setQ(event.target.value)}
        />
        <div className="filters">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`filter-chip ${filter === item.id ? "is-on" : ""}`}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <p className="lead">{filtered.length} dossier{filtered.length > 1 ? "s" : ""}</p>
      <div className="dossier-grid">
        {filtered.map((row) => (
          <Link className="card dossier-card" href={`/admin/${row.id}`} key={row.id}>
            <div className="dossier-top">
              <div className="person">
                <div className="avatar">{initials(row.nomComplet)}</div>
                <div>
                  <strong>{row.nomComplet}</strong>
                  <div className="lead" style={{ margin: 0, fontSize: 12 }}>{row.identifiant}</div>
                </div>
              </div>
              <StatusBadge status={row.global} />
            </div>
            <div className="dossier-dest">
              <span>{row.destination ? `${destinationFlag(row.destination)} ${row.destination}` : "Destination à préciser"}</span>
              <small>{row.programme || "Programme à préciser"}</small>
            </div>
            <div className="progress"><i style={{ width: `${row.percent}%` }} /></div>
            <div className="dossier-meta">
              <span>{row.currentLabel}</span>
              <span>{row.done}/{row.total}</span>
            </div>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="card pad empty-state">
          <h2>Aucun dossier</h2>
          <p className="lead" style={{ margin: 0 }}>Essayez un autre filtre ou une autre recherche.</p>
        </div>
      )}
    </div>
  );
}
