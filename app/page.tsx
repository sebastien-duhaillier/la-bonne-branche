import Link from "next/link";
import DemoNotice from "@/components/demo-notice";

const solutions = [
  {
    number: "01",
    title: "Relation client",
    href: "/solutions/relation-client",
    description:
      "Centralisez vos prospects, leurs coordonnées et l’historique des échanges commerciaux.",
  },
  {
    number: "02",
    title: "Relances automatisées",
    href: "/solutions/automatisation",
    description:
      "Planifiez les messages d’information et les relances sans perdre le suivi humain.",
  },
  {
    number: "03",
    title: "Organisation des contenus",
    href: "/solutions/organisation-contenus",
    description:
      "Structurez les pages et les ressources de votre entreprise dans une arborescence claire.",
  },
];

const statistics = [
  { value: "38 %", label: "de temps administratif économisé" },
  { value: "2,4×", label: "plus de relances effectuées" },
  { value: "100 %", label: "des contenus mieux structurés" },
];

export default function HomePage() {
  return (
    <main>
      <DemoNotice />
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
        <div>
          <p className="inline-flex rounded-full bg-accent-soft px-4 py-2 text-sm font-semibold text-primary-hover">
            Des outils pensés pour les TPE et PME
          </p>

          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Donnez une structure claire à votre activité.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            La Bonne Branche accompagne les entreprises dans l’organisation de
            leur relation client, de leurs contenus et de leurs processus
            quotidiens.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/solutions"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3.5 font-semibold text-white shadow-sm hover:bg-primary-hover"
            >
              Découvrir nos solutions
            </Link>

            <Link
              href="/outils"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-6 py-3.5 font-semibold text-foreground hover:border-primary hover:text-primary"
            >
              Explorer les outils
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 -top-6 size-32 rounded-full bg-accent/25 blur-2xl" />
          <div className="absolute -bottom-8 -right-4 size-40 rounded-full bg-secondary/20 blur-3xl" />

          <article className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-xl shadow-primary/10 sm:p-8">
            <div className="flex items-center justify-between border-b border-border pb-5">
              <div>
                <p className="text-sm font-medium text-muted">Vue d’ensemble</p>
                <h2 className="mt-1 text-xl font-bold text-foreground">
                  Votre activité
                </h2>
              </div>
              <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                Bien organisée
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-surface-muted p-5">
                <p className="text-sm text-muted">Prospects actifs</p>
                <p className="mt-2 text-3xl font-bold text-foreground">24</p>
                <p className="mt-2 text-sm font-medium text-success">
                  +5 ce mois-ci
                </p>
              </div>

              <div className="rounded-2xl bg-accent-soft p-5">
                <p className="text-sm text-muted">Actions à effectuer</p>
                <p className="mt-2 text-3xl font-bold text-foreground">7</p>
                <p className="mt-2 text-sm font-medium text-primary">
                  Cette semaine
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-foreground">
                    Organisation des contenus
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Structure validée à 78 %
                  </p>
                </div>
                <span className="text-sm font-bold text-primary">78 %</span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-muted">
                <div className="h-full w-[78%] rounded-full bg-primary" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary/15 font-bold text-secondary">
                3
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Prochaines actions
                </p>
                <p className="text-sm text-muted">
                  Audit, suivi commercial et mise à jour des contenus
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-3">
          {statistics.map((statistic) => (
            <div key={statistic.label} className="text-center">
              <p className="text-3xl font-bold text-primary">
                {statistic.value}
              </p>
              <p className="mt-2 text-sm text-muted">{statistic.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Nos solutions
            </p>
            <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
              Les bons outils, sur la bonne branche.
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted">
              Nous simplifions les tâches qui ralentissent le développement des
              petites structures.
            </p>
          </div>

          <Link
            href="/solutions"
            className="font-semibold text-primary hover:text-primary-hover"
          >
            Voir toutes les solutions →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {solutions.map((solution) => (
            <article
              key={solution.number}
              className="flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="text-sm font-bold text-accent">
                {solution.number}
              </span>
              <h3 className="mt-6 text-xl font-bold text-foreground">
                {solution.title}
              </h3>
              <p className="mt-3 flex-1 leading-7 text-muted">
                {solution.description}
              </p>
              <Link
                href={solution.href}
                className="mt-6 font-semibold text-primary hover:text-primary-hover"
              >
                En savoir plus →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface-muted/70">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Notre méthode
            </p>
            <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
              Comprendre avant de construire.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              Nous analysons les pratiques, clarifions les responsabilités puis
              concevons une solution simple à maintenir.
            </p>
            <Link
              href="/services"
              className="mt-7 inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-hover"
            >
              Découvrir nos services
            </Link>
          </div>

          <div className="grid gap-3">
            {["Observer les usages", "Clarifier les besoins", "Construire par étapes", "Documenter la solution"].map(
              (step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-primary">
                    {index + 1}
                  </span>
                  <p className="font-semibold text-foreground">{step}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <article className="overflow-hidden rounded-3xl bg-primary text-white shadow-xl shadow-primary/15">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1fr_0.7fr] lg:p-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-accent-soft">
                L’agence
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Une entreprise fictive pour des démonstrations réalistes.
              </h2>
              <p className="mt-5 max-w-2xl leading-8 text-white/80">
                Le site et toutes ses données ont été créés spécialement pour
                présenter des outils sans exposer d’informations réelles.
              </p>
            </div>

            <div className="flex items-center">
              <Link
                href="/agence"
                className="inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-primary hover:bg-accent-soft"
              >
                Comprendre le projet
              </Link>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
