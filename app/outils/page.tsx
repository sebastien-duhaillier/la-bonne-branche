import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Outils de démonstration",
  description:
    "Découvrir les outils reconstruits pour le site fictif La Bonne Branche.",
};

const tools = [
  {
    title: "Comparateur d’arborescences",
    description:
      "Comparer une structure existante et une structure préconisée, isoler les différences et simuler des parcours.",
    href: "/outils/arborescence",
    status: "Disponible",
  },
  {
    title: "Protection des URL",
    description:
      "Enregistrer les pages à conserver, leur responsable et le motif de leur protection.",
    href: null,
    status: "En préparation",
  },
  {
    title: "Suivi des équipes",
    description:
      "Suivre les responsables, les contenus contrôlés et les dernières dates de vérification.",
    href: null,
    status: "En préparation",
  },
  {
    title: "Mutation des utilisateurs",
    description:
      "Préparer le déplacement d’utilisateurs entre plusieurs équipes et vérifier leurs nouveaux accès.",
    href: null,
    status: "En préparation",
  },
];

export default function ToolsPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Démonstrations
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Les outils de La Bonne Branche
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          Ces démonstrations reprennent des besoins rencontrés dans un contexte
          professionnel réel. Le code, les noms, les structures et les données
          ont été recréés pour ce site fictif.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {tools.map((tool, index) => (
            <article
              key={tool.title}
              className="flex flex-col rounded-3xl border border-border bg-surface p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft font-bold text-primary">
                  {index + 1}
                </span>
                <span
                  className={
                    "rounded-full px-3 py-1 text-xs font-semibold " +
                    (tool.href
                      ? "bg-success/10 text-success"
                      : "bg-surface-muted text-muted")
                  }
                >
                  {tool.status}
                </span>
              </div>

              <h2 className="mt-6 text-2xl font-bold text-foreground">
                {tool.title}
              </h2>
              <p className="mt-3 flex-1 leading-7 text-muted">
                {tool.description}
              </p>

              {tool.href ? (
                <Link
                  href={tool.href}
                  className="mt-7 inline-flex w-fit rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-hover"
                >
                  Ouvrir l’outil
                </Link>
              ) : (
                <p className="mt-7 text-sm font-semibold text-muted">
                  Démonstration à venir
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
