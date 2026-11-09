import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-[1fr_auto_auto]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent font-bold text-foreground">
              LBB
            </span>
            <span className="font-bold text-foreground">La Bonne Branche</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted">
            Une entreprise fictive créée pour présenter des outils de gestion
            et d’organisation sans utiliser de données professionnelles réelles.
          </p>
        </div>

        <div>
          <p className="font-semibold text-foreground">Découvrir</p>
          <div className="mt-3 grid gap-2 text-sm text-muted">
            <Link href="/solutions" className="hover:text-primary">
              Solutions
            </Link>
            <Link href="/services" className="hover:text-primary">
              Services
            </Link>
            <Link href="/ressources" className="hover:text-primary">
              Ressources
            </Link>
            <Link href="/outils" className="hover:text-primary">
              Outils de démonstration
            </Link>
          </div>
        </div>

        <div>
          <p className="font-semibold text-foreground">La société</p>
          <div className="mt-3 grid gap-2 text-sm text-muted">
            <Link href="/agence" className="hover:text-primary">
              L’agence
            </Link>
            <Link href="/contact" className="hover:text-primary">
              Contact
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© 2026 La Bonne Branche</p>
          <p>Site de démonstration — aucune donnée réelle.</p>
        </div>
      </div>
    </footer>
  );
}
