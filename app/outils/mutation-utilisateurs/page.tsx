import type { Metadata } from "next";
import Link from "next/link";
import UserMigrationTool from "@/components/user-migration-tool";

export const metadata: Metadata = {
  title: "Mutation des utilisateurs",
  description:
    "Préparer la reprise fictive des comptes, périmètres et autorisations.",
};

export default function UserMigrationPage() {
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
          Mutation des utilisateurs
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          Préparez la reprise des comptes, recensez les futurs périmètres
          d’intervention et contrôlez chaque autorisation avant sa validation.
        </p>

        <div className="mt-6 rounded-2xl border border-primary/20 bg-accent-soft p-5 text-sm leading-6 text-foreground">
          Cette démonstration reproduit un processus de préparation : elle ne
          crée aucun compte, ne modifie aucun droit et n’envoie aucun courriel.
          Les utilisateurs, équipes, adresses et URL sont fictifs. Les données
          restent stockées uniquement dans votre navigateur.
        </div>
      </header>

      <UserMigrationTool />
    </main>
  );
}
