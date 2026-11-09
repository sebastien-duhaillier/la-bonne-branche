import type { Metadata } from "next";
import SiteTreeViewer from "@/components/site-tree-viewer";

export const metadata: Metadata = {
  title: "Outil d’arborescence",
  description: "Explorer la structure fictive du site La Bonne Branche.",
};

export default function SiteTreePage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
      <header className="mb-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Outil de démonstration
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Explorer l’arborescence
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          Visualisez la structure du site fictif, recherchez une page et
          identifiez l’équipe responsable de chaque contenu.
        </p>
      </header>

      <SiteTreeViewer />
    </main>
  );
}
