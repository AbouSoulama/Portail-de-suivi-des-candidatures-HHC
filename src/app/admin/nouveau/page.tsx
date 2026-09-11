import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Topbar } from "@/components/Topbar";
import { NewCandidatForm } from "./NewCandidatForm";
import { SiteFooter } from "@/components/SiteFooter";

export default async function NouveauCandidatPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/suivi");

  return (
    <div className="page">
      <Topbar user={session} />
      <main className="shell">
        <Link className="back-link" href="/admin">← Retour aux dossiers</Link>
        <div className="card pad" style={{ marginTop: 16 }}>
          <div className="eyebrow">Création</div>
          <h1>Nouveau candidat</h1>
          <p className="lead">
            Créez le dossier puis transmettez l’identifiant et le mot de passe au candidat
            (WhatsApp ou e-mail). Il n’y a pas d’inscription publique.
          </p>
          <NewCandidatForm conseiller={`${session.prenom} ${session.nom}`} />
        </div>
        <SiteFooter />
      </main>
    </div>
  );
}
