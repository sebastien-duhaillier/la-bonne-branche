import Link from "next/link";

const navigationItems = [
  { label: "Accueil", href: "/" },
  { label: "Solutions", href: "/solutions" },
  { label: "Services", href: "/services" },
  { label: "Ressources", href: "/ressources" },
  { label: "L’agence", href: "/agence" },
  { label: "Outils", href: "/outils" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-surface/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-accent font-bold text-foreground">
            LBB
          </span>
          <span className="text-lg font-bold text-foreground">
            La Bonne Branche
          </span>
        </Link>

        <div className="hidden items-center gap-5 text-sm font-medium text-muted xl:flex">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-primary">
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href="/contact"
          className="hidden items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover sm:inline-flex"
        >
          Parlons de votre projet
        </Link>

        <details className="relative xl:hidden">
          <summary className="cursor-pointer list-none rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground hover:border-primary">
            Menu
          </summary>
          <div className="absolute right-0 top-14 w-64 rounded-2xl border border-border bg-surface p-3 shadow-xl">
            <div className="grid gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-surface-muted hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="mt-2 rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white hover:bg-primary-hover"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </details>
      </nav>
    </header>
  );
}
