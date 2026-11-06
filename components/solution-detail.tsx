import Link from "next/link";

type SolutionDetailProps = {
  eyebrow: string;
  title: string;
  introduction: string;
  benefits: string[];
  exampleTitle: string;
  exampleDescription: string;
};

export default function SolutionDetail({
  eyebrow,
  title,
  introduction,
  benefits,
  exampleTitle,
  exampleDescription,
}: SolutionDetailProps) {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <Link
          href="/solutions"
          className="text-sm font-semibold text-primary hover:text-primary-hover"
        >
          ← Retour aux solutions
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              {introduction}
            </p>

            <div className="mt-8 grid gap-3">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex gap-3 rounded-2xl border border-border bg-surface p-4"
                >
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-success/10 text-sm font-bold text-success">
                    ✓
                  </span>
                  <p className="text-foreground">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-border bg-surface-muted p-7 sm:p-9">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Exemple d’utilisation
            </p>
            <h2 className="mt-4 text-2xl font-bold text-foreground">
              {exampleTitle}
            </h2>
            <p className="mt-4 leading-7 text-muted">{exampleDescription}</p>
            <Link
              href="/contact"
              className="mt-7 inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-hover"
            >
              Étudier votre besoin
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
