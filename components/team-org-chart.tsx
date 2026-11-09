"use client";

import { teamGroups, type TeamRecord } from "@/data/team-tracking-seed";

type TeamOrgChartProps = {
  records: TeamRecord[];
  onOpenTeam: (id: string) => void;
};

function teamState(record: TeamRecord) {
  if (record.usersUpToDate && record.contentsUpToDate) {
    return {
      label: "Suivi terminé",
      className: "border-success/30 bg-success/10 text-success",
      dot: "bg-success",
    };
  }
  if (record.usersUpToDate || record.contentsUpToDate) {
    return {
      label: "Suivi partiel",
      className: "border-warning/30 bg-warning/10 text-warning",
      dot: "bg-warning",
    };
  }
  return {
    label: "À vérifier",
    className: "border-danger/20 bg-danger/10 text-danger",
    dot: "bg-danger",
  };
}

export default function TeamOrgChart({
  records,
  onOpenTeam,
}: TeamOrgChartProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-8">
      <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Vue organisationnelle
          </p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">
            Organigramme de La Bonne Branche
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Les couleurs synthétisent l’avancement des utilisateurs et des
            contenus. Cliquez sur une équipe pour ouvrir sa fiche.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-semibold">
          <span className="flex items-center gap-2 text-success">
            <span className="size-2.5 rounded-full bg-success" />
            Terminé
          </span>
          <span className="flex items-center gap-2 text-warning">
            <span className="size-2.5 rounded-full bg-warning" />
            Partiel
          </span>
          <span className="flex items-center gap-2 text-danger">
            <span className="size-2.5 rounded-full bg-danger" />
            À vérifier
          </span>
        </div>
      </header>

      <div className="overflow-x-auto pb-4 pt-8">
        <div className="mx-auto min-w-[980px] max-w-[1250px]">
          <div className="flex justify-center">
            <div className="relative w-72 rounded-2xl border-2 border-primary bg-primary px-5 py-4 text-center text-white shadow-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/75">
                Direction générale
              </p>
              <p className="mt-1 text-lg font-bold">La Bonne Branche</p>
              <p className="mt-1 text-xs text-white/80">
                Coordination des trois pôles
              </p>
              <span className="absolute left-1/2 top-full h-8 w-px -translate-x-1/2 bg-primary/40" />
            </div>
          </div>

          <div className="relative mx-[16.66%] mt-8 h-px bg-primary/40">
            <span className="absolute left-0 top-0 h-7 w-px bg-primary/40" />
            <span className="absolute left-1/2 top-0 h-7 w-px -translate-x-1/2 bg-primary/40" />
            <span className="absolute right-0 top-0 h-7 w-px bg-primary/40" />
          </div>

          <div className="grid grid-cols-3 gap-6 pt-7">
            {teamGroups.map((group) => {
              const teams = records.filter((record) => record.group === group);
              const complete = teams.filter(
                (record) =>
                  record.usersUpToDate && record.contentsUpToDate,
              ).length;

              return (
                <section key={group} className="relative">
                  <div className="rounded-2xl border-2 border-primary/40 bg-accent-soft p-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Pôle
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-foreground">
                      {group}
                    </h3>
                    <p className="mt-1 text-xs text-muted">
                      {complete} suivi(s) terminé(s) sur {teams.length}
                    </p>
                  </div>

                  {teams.length > 0 && (
                    <div className="mx-auto h-6 w-px bg-border" />
                  )}

                  <div className="space-y-3">
                    {teams.map((record, index) => {
                      const state = teamState(record);
                      return (
                        <div key={record.id} className="relative">
                          {index > 0 && (
                            <span className="absolute -top-3 left-1/2 h-3 w-px -translate-x-1/2 bg-border" />
                          )}
                          <button
                            type="button"
                            onClick={() => onOpenTeam(record.id)}
                            className="group w-full rounded-2xl border border-border bg-white p-4 text-left shadow-sm hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="font-bold text-foreground group-hover:text-primary">
                                  {record.name}
                                </p>
                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">
                                  {record.fullName ||
                                    "Intitulé complet non renseigné"}
                                </p>
                              </div>
                              <span
                                className={`mt-1 size-3 shrink-0 rounded-full ${state.dot}`}
                              />
                            </div>

                            <div className="mt-4 border-t border-border pt-3">
                              <p className="text-xs font-semibold text-foreground">
                                {record.contact || "Responsable à renseigner"}
                              </p>
                              <p className="mt-1 truncate text-xs text-muted">
                                {record.members.length} utilisateur
                                {record.members.length > 1 ? "s" : ""}
                              </p>
                              <span
                                className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${state.className}`}
                              >
                                {state.label}
                              </span>
                            </div>
                          </button>

                          {index < teams.length - 1 && (
                            <div className="mx-auto h-3 w-px bg-border" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
