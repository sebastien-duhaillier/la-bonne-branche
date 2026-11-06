import Link from "next/link";

const solutions = [
  {
    number: "01",
    title: "Relation client",
    description:
      "Centralisez vos prospects, leurs coordonnées et l’historique des échanges commerciaux.",
  },
  {
    number: "02",
    title: "Relances automatisées",
    description:
      "Planifiez les messages d’information et les relances sans perdre le suivi humain.",
  },
  {
    number: "03",
    title: "Organisation des contenus",
    description:
      "Structurez les pages et les ressources de votre entreprise dans une arborescence claire.",
  },
];

const services = [
  "Audit de votre organisation",
  "Mise en place des outils",
  "Accompagnement des équipes",
  "Formation et documentation",
];

const statistics = [
  {
    value: "38 %",
    label: "de temps administratif économisé",
  },
  {
    value: "2,4×",
    label: "plus de relances effectuées",
  },
  {
    value: "100 %",
    label: "des contenus mieux structurés",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-surface/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent font-bold text-foreground">
              LBB
            </span>

            <span className="text-lg font-bold text-foreground">
              La Bonne Branche
            </span>
          </Link>

          <div className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
            <a href="#solutions" className="hover:text-primary">
              Solutions
            </a>

            <a href="#services" className="hover:text-primary">
              Services
            </a>

            <a href="#agence" className="hover:text-primary">
              L’agence
            </a>

            <a href="#contact" className="hover:text-primary">
              Contact
            </a>
          </div>

          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover"
          >
            Parlons de votre projet
          </a>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div>
            <p className="inline-flex rounded-full bg-accent-soft px-4 py-2 text-sm font-semibold text-primary-hover">
              Des outils pensés pour les TPE et PME
            </p>

            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Donnez une structure claire à votre activité.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              La Bonne Branche accompagne les entreprises dans l’organisation
              de leur relation client, de leurs contenus et de leurs processus
              quotidiens.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#solutions"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3.5 font-semibold text-white shadow-sm hover:bg-primary-hover"
              >
                Découvrir nos solutions
              </a>

              <a
                href="#agence"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-6 py-3.5 font-semibold text-foreground hover:border-primary hover:text-primary"
              >
                Notre approche
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 -top-6 size-32 rounded-full bg-accent/25 blur-2xl" />
            <div className="absolute -bottom-8 -right-4 size-40 rounded-full bg-secondary/20 blur-3xl" />

            <article className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-xl shadow-primary/10 sm:p-8">
              <div className="flex items-center justify-between border-b border-border pb-5">
                <div>
                  <p className="text-sm font-medium text-muted">
                    Vue d’ensemble
                  </p>

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

        <section id="solutions" className="scroll-mt-24">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Nos solutions
              </p>

              <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
                Les bons outils, sur la bonne branche.
              </h2>

              <p className="mt-4 text-lg leading-8 text-muted">
                Nous simplifions les tâches qui ralentissent le développement
                des petites structures.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {solutions.map((solution) => (
                <article
                  key={solution.number}
                  className="rounded-2xl border border-border bg-surface p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="text-sm font-bold text-accent">
                    {solution.number}
                  </span>

                  <h3 className="mt-6 text-xl font-bold text-foreground">
                    {solution.title}
                  </h3>

                  <p className="mt-3 leading-7 text-muted">
                    {solution.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="services"
          className="scroll-mt-24 border-y border-border bg-surface-muted/70"
        >
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Nos services
              </p>

              <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
                Une méthode simple, adaptée à votre organisation.
              </h2>

              <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
                Nous commençons par comprendre vos pratiques avant de proposer
                une solution. L’objectif n’est pas d’ajouter un outil de plus,
                mais de rendre votre travail plus clair.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((service, index) => (
                <article
                  key={service}
                  className="rounded-2xl border border-border bg-surface p-5"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-primary">
                    {index + 1}
                  </span>

                  <p className="mt-5 font-semibold text-foreground">
                    {service}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="agence" className="scroll-mt-24">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <article className="overflow-hidden rounded-3xl bg-primary text-white shadow-xl shadow-primary/15">
              <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1fr_0.8fr] lg:p-16">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-accent-soft">
                    L’agence
                  </p>

                  <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                    Une équipe proche de votre réalité.
                  </h2>

                  <p className="mt-5 max-w-2xl leading-8 text-white/80">
                    La Bonne Branche est une agence fictive spécialisée dans
                    l’accompagnement numérique des petites entreprises. Elle
                    sert de support à la démonstration de nos outils.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6">
                  <p className="font-semibold">Notre engagement</p>

                  <p className="mt-3 leading-7 text-white/80">
                    Concevoir des outils compréhensibles, documentés et
                    réellement adaptés aux personnes qui les utilisent.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24">
          <div className="mx-auto max-w-4xl px-5 pb-20">
            <article className="rounded-3xl border border-border bg-surface p-8 text-center shadow-sm sm:p-12">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Un projet à structurer ?
              </p>

              <h2 className="mt-3 text-3xl font-bold text-foreground">
                Prenons la bonne direction.
              </h2>

              <p className="mx-auto mt-4 max-w-2xl leading-7 text-muted">
                Présentez-nous votre organisation et les difficultés que vous
                rencontrez. Nous identifierons ensemble les premières actions
                utiles.
              </p>

              <a
                href="mailto:contact@la-bonne-branche.example"
                className="mt-7 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3.5 font-semibold text-white hover:bg-primary-hover"
              >
                Nous contacter
              </a>
            </article>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 La Bonne Branche — Entreprise fictive.</p>

          <p>Site de démonstration sans données réelles.</p>
        </div>
      </footer>
    </div>
  );
}