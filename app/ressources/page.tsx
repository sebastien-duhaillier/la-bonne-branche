import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ressources",
  description: "Guides et études de cas de La Bonne Branche.",
};

const resources = [
  {
    type: "Guide",
    title: "Préparer une arborescence de site",
    description:
      "Les questions à poser avant de déplacer, fusionner ou supprimer une rubrique.",
  },
  {
    type: "Méthode",
    title: "Attribuer un responsable à chaque contenu",
    description:
      "Une méthode simple pour éviter les pages sans propriétaire et les informations oubliées.",
  },
  {
    type: "Étude de cas",
    title: "Structurer le suivi commercial d’une petite équipe",
    description:
      "Passer de fichiers dispersés à une vision commune des prospects et des relances.",
  },
];

export default function ResourcesPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Ressources
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Des méthodes à réutiliser.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
          Cette bibliothèque fictive donne de la profondeur au site qui servira
          de support aux futurs outils.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {resources.map((resource) => (
            <article
              key={resource.title}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {resource.type}
              </span>
              <h2 className="mt-4 text-xl font-bold text-foreground">
                {resource.title}
              </h2>
              <p className="mt-3 leading-7 text-muted">
                {resource.description}
              </p>
              <p className="mt-6 text-sm font-semibold text-muted">
                Contenu de démonstration
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
