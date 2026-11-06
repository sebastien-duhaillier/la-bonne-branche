import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description: "L’accompagnement proposé par La Bonne Branche.",
};

const services = [
  {
    number: "01",
    title: "Audit",
    description:
      "Observer les pratiques, les outils existants et les points de blocage avant de proposer une évolution.",
  },
  {
    number: "02",
    title: "Conception",
    description:
      "Transformer les besoins identifiés en parcours, contenus et outils simples à utiliser.",
  },
  {
    number: "03",
    title: "Déploiement",
    description:
      "Mettre en place la solution par étapes et vérifier son fonctionnement dans les conditions réelles.",
  },
  {
    number: "04",
    title: "Accompagnement",
    description:
      "Former les équipes et fournir une documentation qui permet de rester autonome.",
  },
];

export default function ServicesPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Nos services
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Un accompagnement sans solution imposée.
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted">
              L’outil arrive après l’analyse du besoin. Cette méthode évite de
              numériser un fonctionnement déjà confus.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-hover"
            >
              Présenter votre projet
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.number}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <span className="text-sm font-bold text-accent">
                  {service.number}
                </span>
                <h2 className="mt-5 text-xl font-bold text-foreground">
                  {service.title}
                </h2>
                <p className="mt-3 leading-7 text-muted">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
