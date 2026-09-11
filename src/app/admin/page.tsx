import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { readDb } from "@/lib/store";
import { currentStep, globalStatus, progressOf } from "@/lib/steps";
import { Topbar } from "@/components/Topbar";
import { AdminSearch } from "./AdminSearch";
import { SiteFooter } from "@/components/SiteFooter";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/suivi");

  const db = readDb();
  const rows = db.candidats.map((candidat) => {
    const user = db.users.find((item) => item.id === candidat.userId);
    const progress = progressOf(candidat);
    return {
      ...candidat,
      nomComplet: `${user?.prenom ?? ""} ${user?.nom ?? ""}`.trim(),
      identifiant: user?.identifiant ?? "",
      progress,
      current: currentStep(candidat),
      global: globalStatus(candidat),
    };
  });

  const counts = {
    total: rows.length,
    enCours: rows.filter((row) => row.global === "en_cours").length,
    attente: rows.filter((row) => row.global === "bloque").length,
    valides: rows.filter((row) => row.global === "valide").length,
  };

  return (
    <div className="page">
      <Topbar user={session} />
      <main className="shell">
        <div className="page-head">
          <div>
            <div className="eyebrow">Back-office</div>
            <h1>Dossiers en mouvement</h1>
            <p className="lead" style={{ margin: 0 }}>
              Bonjour {session.prenom}. Mettez à jour le suivi vu par chaque candidat.
            </p>
          </div>
          <Link className="btn btn-primary" href="/admin/nouveau">
            + Nouveau candidat
          </Link>
        </div>

        <div className="grid stats">
          <div className="card stat"><b>{counts.total}</b><span>Candidats actifs</span></div>
          <div className="card stat"><b>{counts.enCours}</b><span>En cours</span></div>
          <div className="card stat"><b>{counts.attente}</b><span>En attente</span></div>
          <div className="card stat"><b>{counts.valides}</b><span>Terminés</span></div>
        </div>

        <AdminSearch
          rows={rows.map((row) => ({
            id: row.id,
            nomComplet: row.nomComplet,
            identifiant: row.identifiant,
            destination: row.destination,
            programme: row.programme,
            conseiller: row.conseiller,
            percent: row.progress.percent,
            done: row.progress.done,
            total: row.progress.total,
            currentLabel: row.current?.label ?? "—",
            global: row.global,
          }))}
        />
        <SiteFooter />
      </main>
    </div>
  );
}
