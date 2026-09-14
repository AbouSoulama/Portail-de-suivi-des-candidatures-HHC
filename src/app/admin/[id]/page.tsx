import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { readDb } from "@/lib/store";
import { progressOf } from "@/lib/steps";
import { Topbar } from "@/components/Topbar";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressRing } from "@/components/ProgressRing";
import { SiteFooter } from "@/components/SiteFooter";
import { destinationFlag } from "@/lib/ui";
import { CandidatEditor } from "./CandidatEditor";
import { StepEditor } from "./StepEditor";
import { ResetPassword } from "./ResetPassword";

export default async function CandidatAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/suivi");

  const { id } = await params;
  const db = await readDb();
  const candidat = db.candidats.find((item) => item.id === id);
  if (!candidat) notFound();
  const user = db.users.find((item) => item.id === candidat.userId);
  if (!user) notFound();

  const progress = progressOf(candidat);

  return (
    <div className="page">
      <Topbar user={session} />
      <main className="shell">
        <Link className="back-link" href="/admin">← Retour aux dossiers</Link>
        <div className="card hero-card hero-split" style={{ marginTop: 16 }}>
          <div>
            <div className="eyebrow" style={{ color: "#f3c07a" }}>Dossier candidat</div>
            <h1>{user.prenom} {user.nom}</h1>
            <p className="lead" style={{ marginBottom: 8 }}>Identifiant : {user.identifiant}</p>
            <div className="chips">
              {candidat.destination && (
                <span className="chip">{destinationFlag(candidat.destination)} <b>{candidat.destination}</b></span>
              )}
              {candidat.programme && <span className="chip">{candidat.programme}</span>}
            </div>
            <StatusBadge status={progress.done === progress.total ? "valide" : "en_cours"} />
          </div>
          <ProgressRing percent={progress.percent} label={`${progress.done}/${progress.total} étapes`} tone="dark" />
        </div>

        <div className="two">
          <div className="card pad">
            <h2>Fiche candidat</h2>
            <CandidatEditor
              candidat={{
                id: candidat.id,
                prenom: user.prenom,
                nom: user.nom,
                telephone: candidat.telephone,
                destination: candidat.destination,
                programme: candidat.programme,
                niveau: candidat.niveau,
                conseiller: candidat.conseiller,
                noteInterne: candidat.noteInterne,
              }}
            />
          </div>
          <div>
            <div className="card pad">
              <h2>Identifiants</h2>
              <p className="lead">Le candidat se connecte avec l’identifiant ci-dessus. Vous pouvez régénérer un mot de passe à lui transmettre.</p>
              <ResetPassword userId={user.id} />
            </div>
          </div>
        </div>

        <div className="card pad" style={{ marginTop: 16 }}>
          <h2>Suivi des étapes</h2>
          <p className="lead">Chaque commentaire saisi ici apparaît dans l’espace du candidat.</p>
          {candidat.steps.map((step) => (
            <StepEditor key={step.id} candidatId={candidat.id} step={step} />
          ))}
        </div>
        <SiteFooter />
      </main>
    </div>
  );
}
