"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const storageKey = "la-bonne-branche-demo-notice";

export default function DemoNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem(storageKey) !== "closed") {
      setIsVisible(true);
    }
  }, []);

  function closeNotice() {
    window.sessionStorage.setItem(storageKey, "closed");
    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/45 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-notice-title"
        className="w-full max-w-2xl rounded-3xl border border-border bg-surface p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-lg font-bold text-primary">
            LBB
          </span>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              À propos de cette démonstration
            </p>
            <h2
              id="demo-notice-title"
              className="mt-2 text-2xl font-bold text-foreground sm:text-3xl"
            >
              Un site fictif pour présenter des outils réels.
            </h2>
          </div>
        </div>

        <div className="mt-6 space-y-4 leading-7 text-muted">
          <p>
            Ces outils ont été imaginés pour répondre à des besoins rencontrés
            lors d’un travail réalisé sur un site public administré en
            préfecture, dont l’arborescence et le volume étaient bien plus
            importants.
          </p>
          <p>
            Afin de ne publier aucune donnée, identité, procédure ou information
            confidentielle, l’ensemble a été réécrit autour de l’entreprise
            fictive La Bonne Branche.
          </p>
          <p>
            Les démonstrations sont regroupées dans l’onglet
            <strong className="text-foreground"> Outils</strong>.
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={closeNotice}
            className="rounded-xl border border-border px-5 py-3 font-semibold text-foreground hover:border-primary hover:text-primary"
          >
            Continuer sur le site
          </button>
          <Link
            href="/outils"
            onClick={closeNotice}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-hover"
          >
            Découvrir les outils
          </Link>
        </div>
      </section>
    </div>
  );
}
