import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacter l’agence fictive La Bonne Branche.",
};

export default function ContactPage() {
  return (
    <main>
      <section className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Contact
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Parlons de votre organisation.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              Cette page clôt le parcours du site fictif. Aucun formulaire
              n’envoie réellement de données.
            </p>

            <div className="mt-9 rounded-3xl border border-border bg-surface p-7">
              <h2 className="text-xl font-bold text-foreground">
                La Bonne Branche
              </h2>
              <dl className="mt-5 grid gap-5">
                <div>
                  <dt className="text-sm font-medium text-muted">Adresse</dt>
                  <dd className="mt-1 font-semibold text-foreground">
                    12 rue des Possibles, 89000 Belrive
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted">Téléphone</dt>
                  <dd className="mt-1 font-semibold text-foreground">
                    01 80 00 00 00
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted">E-mail fictif</dt>
                  <dd className="mt-1 font-semibold text-foreground">
                    contact@la-bonne-branche.example
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <aside className="rounded-3xl bg-primary p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent-soft">
              Démonstration
            </p>
            <h2 className="mt-4 text-2xl font-bold">
              Aucune information ne sera transmise.
            </h2>
            <p className="mt-4 leading-7 text-white/80">
              Les coordonnées, la ville et l’entreprise présentées ici sont
              inventées. Le futur outil pourra donc les manipuler sans exposer
              de données personnelles ou professionnelles.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
