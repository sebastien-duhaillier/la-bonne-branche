import type { Metadata } from "next";
import Link from "next/link";
import TeamTrackingTool from "@/components/team-tracking-tool";

export const metadata: Metadata = {
  title: "Suivi des équipes",
  description:
    "Suivre les contacts, les accès utilisateurs et la vérification des contenus d’équipes fictives.",
};

export default function TeamTrackingPage() {
  return (
    <main className="mx-auto max-w-[1500px] px-5 py-12 sm:py-16">
      <Link
        href="/outils"
        className="text-sm font-semibold text-primary hover:text-primary-hover"
      >
        ← Retour aux outils
      </Link>

      <header className="mb-10 mt-8 max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Outil de démonstration
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Suivi des équipes et des contenus
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          Recensez les équipes, leurs contacts et leurs utilisateurs, puis
          suivez séparément la vérification des accès et celle des contenus.
        </p>

        <div className="mt-6 rounded-2xl border border-primary/20 bg-accent-soft p-5 text-sm leading-6 text-foreground">
          L’outil d’origine suivait un grand nombre de services et de comptes
          sur un site public. Cette reconstruction utilise uniquement une
          organisation commerciale, des personnes et des données fictives.
          Les modifications restent enregistrées dans votre navigateur.
        </div>
      </header>

      <TeamTrackingTool />
    </main>
  );
}
