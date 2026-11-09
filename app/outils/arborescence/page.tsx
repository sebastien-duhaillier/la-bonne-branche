import type { Metadata } from "next";
import Link from "next/link";
import SiteTreeViewer from "@/components/site-tree-viewer";

export const metadata: Metadata = {
  title: "Comparateur d’arborescences",
  description:
    "Comparer deux structures fictives et simuler les parcours des visiteurs.",
};

export default function SiteTreePage() {
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
          Comparer deux arborescences
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          Analysez une ancienne structure fictive et sa version préconisée.
          L’outil permet d’isoler une branche, d’afficher les différences par
          niveau et de simuler la recherche d’une information.
        </p>

        <div className="mt-6 rounded-2xl border border-primary/20 bg-accent-soft p-5 text-sm leading-6 text-foreground">
          Cette démonstration reproduit le fonctionnement général d’un outil
          utilisé sur un site public beaucoup plus conséquent. Les rubriques,
          URL, équipes et résultats présentés ici sont entièrement fictifs.
        </div>
      </header>

      <SiteTreeViewer />
    </main>
  );
}
