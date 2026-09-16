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
    
  );
}
