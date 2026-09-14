import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./LoginForm";
import { SiteHomeLink } from "@/components/SiteHomeLink";

const destinations = ["🇫🇷 France", "🇨🇦 Canada", "🇨🇳 Chine", "🇨🇭 Suisse", "🇱🇺 Luxembourg", "🇺🇸 USA", "🇲🇦 Maroc"];

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect(session.role === "admin" ? "/admin" : "/suivi");
  }

  return (
    <div className="login-wrap">
      <section className="login-stage">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div>
          <div className="login-kicker">Hamine Happy Consulting · Espace privé</div>
          <h1>De l’orientation au départ, votre dossier sous les yeux.</h1>
          <p>
            Chaque étape est mise à jour par votre conseiller. Vous voyez clairement
            où vous en êtes — sans relancer, sans attendre.
          </p>
          <div className="login-destinations">
            {destinations.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <p className="login-legal">Cabinet reconnu au Burkina Faso · Accompagnement international</p>
      </section>
      <section className="login-panel">
        <div className="login-card">
          <SiteHomeLink className="login-logo-link">
            <img className="login-logo" src="/logo.png" alt="Hamine Happy Consulting" />
          </SiteHomeLink>
          <div className="center">
            <div className="eyebrow">Espace candidat</div>
            <h1>Heureux de vous revoir</h1>
            <p className="lead">Identifiants transmis par votre conseiller Hamine Happy.</p>
          </div>
          <LoginForm />
        </div>
      </section>
    </div>
  );
}
