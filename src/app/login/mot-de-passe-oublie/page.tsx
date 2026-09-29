import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SiteHomeLink } from "@/components/SiteHomeLink";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export default async function ForgotPasswordPage() {
  const session = await getSession();
  if (session) {
    redirect(session.role === "admin" ? "/admin" : "/suivi");
  }

  return (
    <section className="login-panel login-solo">
      <div className="login-card">
        <SiteHomeLink className="login-logo-link">
          <img className="login-logo" src="/logo.png" alt="Hamine Happy Consulting" />
        </SiteHomeLink>
        <div className="center">
          <div className="eyebrow">Mot de passe oublié</div>
          <h1>Définir un nouveau mot de passe</h1>
          <p className="lead">
            Confirmez votre identité avec les informations de votre dossier, puis choisissez un nouveau mot de passe.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </section>
  );
}
