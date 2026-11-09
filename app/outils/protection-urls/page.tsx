import type { Metadata } from "next";
import Link from "next/link";
import UrlProtectionTool from "@/components/url-protection-tool";

export const metadata: Metadata = {
  title: "Protection des URL",
  description:
    "Enregistrer, contrôler et suivre des règles fictives de conservation d’URL.",
};

export default function UrlProtectionPage() {
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
          Protection et suivi des URL
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          Centralisez les demandes de conservation, contrôlez si une page est
          couverte par une règle et suivez la vérification des contenus.
        </p>

        <div className="mt-6 rounded-2xl border border-primary/20 bg-accent-soft p-5 text-sm leading-6 text-foreground">
          Cette version publique conserve la logique métier générale d’un outil
          conçu pour un site institutionnel bien plus important. Le domaine,
          les services, les personnes et toutes les données sont fictifs. Les
          changements sont enregistrés uniquement dans votre navigateur.
        </div>
      </header>

      <UrlProtectionTool />
    </main>
  );
}
