import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { readDb } from "@/lib/store";
import { currentStep, progressOf } from "@/lib/steps";
import { destinationFlag } from "@/lib/ui";
import { Topbar } from "@/components/Topbar";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressRing } from "@/components/ProgressRing";
import { StepIcon } from "@/components/StepIcon";
import { SiteFooter } from "@/components/SiteFooter";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function SuiviPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "admin") redirect("/admin");

  const db = readDb();
  const candidat = db.candidats.find((item) => item.userId === session.id);
  if (!candidat) {
    return (
      <div className="page">
        <Topbar user={session} />
        <main className="shell">
          <div className="card pad">
            <h1>Aucun dossier</h1>
            <p className="lead">Votre espace n’est pas encore lié à un suivi. Contactez l’équipe Hamine Happy.</p>
          </div>
        </main>
      </div>
    );
  }

  const progress = progressOf(candidat);
  const current = currentStep(candidat);

  return (
    <div className="page">
      <Topbar user={session} />
      <main className="shell">
        <section className="card hero-card hero-split">
          <div>
            <div className="eyebrow" style={{ color: "#f3c07a" }}>Votre accompagnement</div>
            <h1>Bonjour {session.prenom}</h1>
            <p className="lead">Votre projet avance. Voici exactement où en est le dossier aujourd’hui.</p>
            <div className="chips">
              {candidat.destination && (
                <span className="chip">
                  {destinationFlag(candidat.destination)} <b>{candidat.destination}</b>
                </span>
              )}
              {candidat.niveau && <span className="chip">Niveau <b>{candidat.niveau}</b></span>}
              {candidat.conseiller && <span className="chip">Conseiller <b>{candidat.conseiller}</b></span>}
            </div>
            {candidat.programme && <p className="hero-program">{candidat.programme}</p>}
          </div>
          <ProgressRing percent={progress.percent} label={`${progress.done}/${progress.total} étapes`} tone="dark" />
        </section>

        <div className="journey-strip">
          {candidat.steps.map((step, index) => (
            <div
              key={step.id}
              className={`journey-node ${step.status} ${current?.id === step.id ? "is-current" : ""}`}
            >
              <i>{String(index + 1).padStart(2, "0")}</i>
              <span>{step.label}</span>
            </div>
          ))}
        </div>

        {current && (
          <section className="card current-card current-rich">
            <div>
              <div className="eyebrow">Étape actuelle</div>
              <h2>{current.label}</h2>
              <StatusBadge status={current.status} code={current.code} />
              {current.commentaire ? (
                <blockquote className="advisor-note">{current.commentaire}</blockquote>
              ) : (
                <p className="lead" style={{ marginTop: 14, marginBottom: 0 }}>
                  Votre conseiller n’a pas encore laissé de message sur cette étape.
                </p>
              )}
            </div>
            <div className="current-icon">
              <StepIcon code={current.code} />
            </div>
          </section>
        )}

        <section className="card pad">
          <div className="eyebrow">Parcours</div>
          <h2>Suivi de votre dossier</h2>
          <p className="lead">Chaque commentaire ci-dessous vient de votre conseiller.</p>
          <div className="timeline">
            {candidat.steps.map((step, index) => {
              const active = current?.id === step.id;
              return (
                <div className="step" key={step.id}>
                  <div className="rail">
                    <div className={`dot ${step.status}`}>
                      <StepIcon code={step.code} />
                    </div>
                  </div>
                  <div className={`step-card ${active ? "active" : ""}`}>
                    <div className="step-head">
                      <div>
                        <small>Étape {String(index + 1).padStart(2, "0")}</small>
                        <strong>{step.label}</strong>
                      </div>
                      <StatusBadge status={step.status} code={step.code} />
                    </div>
                    {step.commentaire ? (
                      <p className="step-comment">{step.commentaire}</p>
                    ) : (
                      <p className="lead" style={{ margin: "10px 0 0" }}>
                        Pas encore de commentaire sur cette étape.
                      </p>
                    )}
                    <p className="lead" style={{ margin: "8px 0 0", fontSize: 12 }}>
                      Mis à jour le {formatDate(step.updatedAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <SiteFooter />
      </main>
    </div>
  );
}
