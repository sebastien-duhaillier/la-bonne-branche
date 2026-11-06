import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Solutions",
  description: "Les solutions proposées par La Bonne Branche.",
};

const solutions = [
  {
    title: "Relation client",
    href: "/solutions/relation-client",
    description:
      "Centraliser les contacts, les échanges et les prochaines actions commerciales.",
    label: "Suivi",
  },
  {
    title: "Automatisation",
    href: "/solutions/automatisation",
    description:
      "Programmer des messages utiles sans perdre le contrôle de la relation.",
    label: "Relances",
  },
  {
    title: "Organisation des contenus",
    href: "/solutions/organisation-contenus",
    description:
      "Construire une arborescence claire et attribuer chaque contenu au bon service.",
    label: "Structure",
  },
];

export default function SolutionsPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Nos solutions
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Des outils conçus autour du travail réel.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
          Chaque solution répond à un problème concret : retrouver une
          information, suivre une action ou clarifier la responsabilité d’un
          contenu.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {solutions.map((solution) => (
            <article
              key={solution.href}
              className="flex flex-col rounded-3xl border border-border bg-surface p-6 shadow-sm"
            >
              <span className="w-fit rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-primary">
                {solution.label}
              </span>
              <h2 className="mt-6 text-2xl font-bold text-foreground">
                {solution.title}
              </h2>
              <p className="mt-3 flex-1 leading-7 text-muted">
                {solution.description}
              </p>
              <Link
                href={solution.href}
                className="mt-7 font-semibold text-primary hover:text-primary-hover"
              >
                Découvrir la solution →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
