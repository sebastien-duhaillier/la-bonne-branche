import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "L’agence",
  description: "Présentation de l’agence fictive La Bonne Branche.",
};

const teams = [
  "Direction",
  "Commercial",
  "Marketing et contenus",
  "Conseil et projets",
  "Support client",
];

export default function AgencyPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              L’agence
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Une société fictive, une organisation crédible.
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted">
              La Bonne Branche représente une entreprise de conseil numérique
              destinée aux TPE et PME. Elle sert de terrain de démonstration à
              des outils reconstruits avec des données entièrement fictives.
            </p>
            <p className="mt-4 leading-7 text-muted">
              Cette séparation est volontaire : aucune donnée, identité,
              arborescence ou procédure issue d’un environnement professionnel
              réel n’est publiée dans ce projet.
            </p>
          </div>

          <aside className="rounded-3xl border border-border bg-surface p-7">
            <h2 className="text-xl font-bold text-foreground">
              Équipes représentées
            </h2>
            <div className="mt-5 grid gap-3">
              {teams.map((team) => (
                <div
                  key={team}
                  className="rounded-xl bg-surface-muted px-4 py-3 font-medium text-foreground"
                >
                  {team}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
