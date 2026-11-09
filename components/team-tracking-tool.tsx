"use client";

import { useEffect, useMemo, useState } from "react";
import {
  checkStateLabels,
  teamGroups,
  teamSeed,
  type CheckState,
  type TeamGroup,
  type TeamRecord,
} from "@/data/team-tracking-seed";

type StatusFilter = "all" | "incomplete" | "users" | "contents" | "done" | "presence";

const storageKey = "la-bonne-branche-team-tracking-v1";
const inputClass =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function emptyTeam(): TeamRecord {
  return {
    id: "",
    group: "Commerce",
    name: "",
    fullName: "",
    toolPresence: "review",
    directAccess: "review",
    workspace: "",
    contact: "",
    email: "",
    members: [],
    usersUpToDate: false,
    usersCheckedAt: "",
    contentsUpToDate: false,
    contentsCheckedAt: "",
    notes: "",
  };
}

function isTeamRecord(value: unknown): value is TeamRecord {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<TeamRecord>;
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.fullName === "string" &&
    teamGroups.includes(item.group as TeamGroup) &&
    ["yes", "no", "review"].includes(item.toolPresence ?? "") &&
    ["yes", "no", "review"].includes(item.directAccess ?? "") &&
    Array.isArray(item.members)
  );
}

function statusClass(done: boolean) {
  return done
    ? "border-success/20 bg-success/10 text-success"
    : "border-warning/20 bg-warning/10 text-warning";
}

export default function TeamTrackingTool() {
  const [records, setRecords] = useState<TeamRecord[]>(teamSeed);
  const [hydrated, setHydrated] = useState(false);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<"all" | TeamGroup>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [editing, setEditing] = useState<TeamRecord | null>(null);
  const [membersText, setMembersText] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.every(isTeamRecord)) setRecords(parsed);
      }
    } catch {
      // Les données fictives restent disponibles.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(storageKey, JSON.stringify(records));
  }, [hydrated, records]);

  const filtered = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("fr");
    return records.filter((record) => {
      const matchesSearch = [
        record.name,
        record.fullName,
        record.contact,
        record.email,
        record.workspace,
        record.members.join(" "),
      ]
        .join(" ")
        .toLocaleLowerCase("fr")
        .includes(search);
      const matchesGroup = group === "all" || record.group === group;
      const matchesStatus =
        status === "all" ||
        (status === "incomplete" &&
          (!record.usersUpToDate || !record.contentsUpToDate)) ||
        (status === "users" && !record.usersUpToDate) ||
        (status === "contents" && !record.contentsUpToDate) ||
        (status === "done" &&
          record.usersUpToDate &&
          record.contentsUpToDate) ||
        (status === "presence" && record.toolPresence === "review");
      return matchesSearch && matchesGroup && matchesStatus;
    });
  }, [group, query, records, status]);

  const totals = {
    all: records.length,
    users: records.filter((record) => record.usersUpToDate).length,
    contents: records.filter((record) => record.contentsUpToDate).length,
    done: records.filter(
      (record) => record.usersUpToDate && record.contentsUpToDate,
    ).length,
  };

  function patchRecord(id: string, patch: Partial<TeamRecord>) {
    setRecords((current) =>
      current.map((record) =>
        record.id === id ? { ...record, ...patch } : record,
      ),
    );
  }

  function toggleTracking(
    record: TeamRecord,
    kind: "users" | "contents",
    checked: boolean,
  ) {
    patchRecord(
      record.id,
      kind === "users"
        ? {
            usersUpToDate: checked,
            usersCheckedAt: checked ? today() : "",
          }
        : {
            contentsUpToDate: checked,
            contentsCheckedAt: checked ? today() : "",
          },
    );
  }

  function startAdd() {
    setEditing(emptyTeam());
    setMembersText("");
    setMessage("");
  }

  function startEdit(record: TeamRecord) {
    setEditing({ ...record });
    setMembersText(record.members.join("\n"));
    setMessage("");
  }

  function saveTeam(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    if (!editing.name.trim()) {
      setMessage("Le nom de l’équipe est obligatoire.");
      return;
    }
    const saved = {
      ...editing,
      id: editing.id || crypto.randomUUID(),
      name: editing.name.trim(),
      fullName: editing.fullName.trim(),
      contact: editing.contact.trim(),
      email: editing.email.trim(),
      workspace: editing.workspace.trim(),
      notes: editing.notes.trim(),
      members: membersText
        .split(/\r?\n/)
        .map((member) => member.trim())
        .filter(Boolean),
    };
    setRecords((current) =>
      editing.id
        ? current.map((record) => (record.id === editing.id ? saved : record))
        : [...current, saved],
    );
    setEditing(null);
    setMessage(editing.id ? "L’équipe a été modifiée." : "L’équipe a été ajoutée.");
  }

  function deleteTeam(record: TeamRecord) {
    if (!confirm(`Supprimer définitivement l’équipe « ${record.name} » ?`))
      return;
    setRecords((current) => current.filter((item) => item.id !== record.id));
    setMessage("L’équipe a été supprimée.");
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(records, null, 2)], {
      type: "application/json",
    });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "la-bonne-branche-suivi-equipes.json";
    link.click();
    URL.revokeObjectURL(href);
  }

  async function importJson(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!Array.isArray(parsed) || !parsed.every(isTeamRecord)) {
        throw new Error("Le fichier ne contient pas des équipes valides.");
      }
      setRecords(parsed);
      setMessage(`${parsed.length} équipe(s) importée(s).`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Fichier invalide.");
    }
    event.target.value = "";
  }

  function resetDemo() {
    if (!confirm("Restaurer toutes les données fictives initiales ?")) return;
    setRecords(teamSeed);
    setOpenIds([]);
    setMessage("Les données fictives ont été restaurées.");
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Équipes recensées", totals.all],
          ["Accès utilisateurs à jour", `${totals.users} / ${totals.all}`],
          ["Contenus vérifiés", `${totals.contents} / ${totals.all}`],
          ["Suivis terminés", `${totals.done} / ${totals.all}`],
        ].map(([label, value]) => (
          <article
            key={label}
            className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-muted">{label}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          </article>
        ))}
      </div>

      {message && (
        <p className="rounded-xl border border-primary/20 bg-accent-soft px-4 py-3 text-sm font-medium text-foreground">
          {message}
        </p>
      )}

      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_190px_240px_auto]">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className={inputClass}
            placeholder="Rechercher une équipe, un contact ou un utilisateur"
          />
          <select
            value={group}
            onChange={(event) =>
              setGroup(event.target.value as "all" | TeamGroup)
            }
            className={inputClass}
          >
            <option value="all">Tous les pôles</option>
            {teamGroups.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as StatusFilter)
            }
            className={inputClass}
          >
            <option value="all">Tous les états</option>
            <option value="incomplete">Suivi incomplet</option>
            <option value="users">Utilisateurs non à jour</option>
            <option value="contents">Contenus non vérifiés</option>
            <option value="done">Tout à jour</option>
            <option value="presence">Présence à vérifier</option>
          </select>
          <button
            type="button"
            onClick={startAdd}
            className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-white hover:bg-primary-hover"
          >
            Ajouter une équipe
          </button>
        </div>
      </div>

      {editing && (
        <form
          onSubmit={saveTeam}
          className="rounded-2xl border border-primary/20 bg-surface p-6 shadow-sm"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-foreground">
              {editing.id ? "Modifier l’équipe" : "Nouvelle équipe"}
            </h2>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="text-sm font-semibold text-muted hover:text-foreground"
            >
              Fermer
            </button>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="text-sm font-semibold text-foreground">
              Nom court *
              <input
                required
                value={editing.name}
                onChange={(event) =>
                  setEditing({ ...editing, name: event.target.value })
                }
                className={`mt-2 ${inputClass}`}
              />
            </label>
            <label className="text-sm font-semibold text-foreground">
              Nom complet
              <input
                value={editing.fullName}
                onChange={(event) =>
                  setEditing({ ...editing, fullName: event.target.value })
                }
                className={`mt-2 ${inputClass}`}
              />
            </label>
            <label className="text-sm font-semibold text-foreground">
              Pôle
              <select
                value={editing.group}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    group: event.target.value as TeamGroup,
                  })
                }
                className={`mt-2 ${inputClass}`}
              >
                {teamGroups.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold text-foreground">
              Espace de travail
              <input
                value={editing.workspace}
                onChange={(event) =>
                  setEditing({ ...editing, workspace: event.target.value })
                }
                className={`mt-2 ${inputClass}`}
              />
            </label>
            <label className="text-sm font-semibold text-foreground">
              Contact
              <input
                value={editing.contact}
                onChange={(event) =>
                  setEditing({ ...editing, contact: event.target.value })
                }
                className={`mt-2 ${inputClass}`}
              />
            </label>
            <label className="text-sm font-semibold text-foreground">
              Adresse e-mail
              <input
                type="email"
                value={editing.email}
                onChange={(event) =>
                  setEditing({ ...editing, email: event.target.value })
                }
                className={`mt-2 ${inputClass}`}
              />
            </label>
            <label className="text-sm font-semibold text-foreground">
              Présence dans l’outil
              <select
                value={editing.toolPresence}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    toolPresence: event.target.value as CheckState,
                  })
                }
                className={`mt-2 ${inputClass}`}
              >
                {Object.entries(checkStateLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold text-foreground">
              Accès direct
              <select
                value={editing.directAccess}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    directAccess: event.target.value as CheckState,
                  })
                }
                className={`mt-2 ${inputClass}`}
              >
                {Object.entries(checkStateLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold text-foreground">
              Utilisateurs, un par ligne
              <textarea
                rows={5}
                value={membersText}
                onChange={(event) => setMembersText(event.target.value)}
                className={`mt-2 ${inputClass}`}
              />
            </label>
            <label className="text-sm font-semibold text-foreground">
              Notes
              <textarea
                rows={5}
                value={editing.notes}
                onChange={(event) =>
                  setEditing({ ...editing, notes: event.target.value })
                }
                className={`mt-2 ${inputClass}`}
              />
            </label>
          </div>
          <button className="mt-5 rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-hover">
            Enregistrer l’équipe
          </button>
        </form>
      )}

      <div className="space-y-8">
        {teamGroups.map((currentGroup) => {
          const items = filtered.filter((record) => record.group === currentGroup);
          if (!items.length) return null;
          return (
            <section key={currentGroup}>
              <h2 className="mb-4 text-xl font-bold text-foreground">
                {currentGroup} <span className="text-muted">({items.length})</span>
              </h2>
              <div className="space-y-3">
                {items.map((record) => {
                  const isOpen = openIds.includes(record.id);
                  return (
                    <article
                      key={record.id}
                      className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenIds((current) =>
                            isOpen
                              ? current.filter((id) => id !== record.id)
                              : [...current, record.id],
                          )
                        }
                        className="flex w-full flex-col gap-4 p-5 text-left hover:bg-surface-muted/50 md:flex-row md:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-lg font-bold text-foreground">
                            {record.name}
                          </p>
                          <p className="mt-1 text-sm text-muted">
                            {record.fullName || "Nom complet non renseigné"}
                          </p>
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(record.usersUpToDate)}`}>
                          Utilisateurs : {record.usersUpToDate ? "à jour" : "à vérifier"}
                        </span>
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(record.contentsUpToDate)}`}>
                          Contenus : {record.contentsUpToDate ? "à jour" : "à vérifier"}
                        </span>
                        <span className="text-xl text-primary">{isOpen ? "−" : "+"}</span>
                      </button>

                      {isOpen && (
                        <div className="border-t border-border p-5">
                          <div className="grid gap-5 lg:grid-cols-2">
                            <section className="rounded-xl bg-surface-muted p-4">
                              <h3 className="font-bold text-foreground">Accès et rattachement</h3>
                              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                                <div><dt className="text-muted">Présence dans l’outil</dt><dd className="mt-1 font-semibold">{checkStateLabels[record.toolPresence]}</dd></div>
                                <div><dt className="text-muted">Accès direct</dt><dd className="mt-1 font-semibold">{checkStateLabels[record.directAccess]}</dd></div>
                                <div className="sm:col-span-2"><dt className="text-muted">Espace de travail</dt><dd className="mt-1 font-semibold">{record.workspace || "Non renseigné"}</dd></div>
                              </dl>
                            </section>

                            <section className="rounded-xl bg-surface-muted p-4">
                              <h3 className="font-bold text-foreground">Contact et utilisateurs</h3>
                              <p className="mt-3 font-semibold">{record.contact || "Contact non renseigné"}</p>
                              <p className="mt-1 text-sm text-muted">{record.email || "Adresse non renseignée"}</p>
                              <ul className="mt-3 list-inside list-disc text-sm text-muted">
                                {record.members.length ? record.members.map((member) => <li key={member}>{member}</li>) : <li>Aucun utilisateur identifié</li>}
                              </ul>
                            </section>
                          </div>

                          <div className="mt-5 grid gap-4 lg:grid-cols-2">
                            <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${statusClass(record.usersUpToDate)}`}>
                              <input
                                type="checkbox"
                                checked={record.usersUpToDate}
                                onChange={(event) =>
                                  toggleTracking(record, "users", event.target.checked)
                                }
                                className="mt-0.5 size-5 accent-[var(--success)]"
                              />
                              <span><strong className="block">Utilisateurs à jour</strong><span className="mt-1 block text-xs">Date : {record.usersCheckedAt || "non vérifié"}</span></span>
                            </label>
                            <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${statusClass(record.contentsUpToDate)}`}>
                              <input
                                type="checkbox"
                                checked={record.contentsUpToDate}
                                onChange={(event) =>
                                  toggleTracking(record, "contents", event.target.checked)
                                }
                                className="mt-0.5 size-5 accent-[var(--success)]"
                              />
                              <span><strong className="block">Contenus vérifiés</strong><span className="mt-1 block text-xs">Date : {record.contentsCheckedAt || "non vérifié"}</span></span>
                            </label>
                          </div>

                          {record.notes && (
                            <p className="mt-5 rounded-xl border-l-4 border-accent bg-accent-soft p-4 text-sm leading-6 text-foreground">
                              {record.notes}
                            </p>
                          )}

                          <div className="mt-5 flex gap-4">
                            <button type="button" onClick={() => startEdit(record)} className="font-semibold text-primary hover:text-primary-hover">Modifier la fiche</button>
                            <button type="button" onClick={() => deleteTeam(record)} className="font-semibold text-danger">Supprimer</button>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {!filtered.length && (
        <p className="rounded-2xl border border-border bg-surface p-10 text-center text-muted">
          Aucune équipe ne correspond aux filtres.
        </p>
      )}

      <div className="flex flex-wrap gap-3 rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <button type="button" onClick={exportJson} className="rounded-xl border border-primary px-4 py-2.5 font-semibold text-primary hover:bg-primary hover:text-white">
          Exporter en JSON
        </button>
        <label className="cursor-pointer rounded-xl border border-border px-4 py-2.5 font-semibold text-foreground hover:bg-surface-muted">
          Importer un JSON
          <input type="file" accept="application/json" onChange={importJson} className="sr-only" />
        </label>
        <button type="button" onClick={resetDemo} className="rounded-xl px-4 py-2.5 font-semibold text-danger hover:bg-danger/10">
          Réinitialiser la démo
        </button>
      </div>
    </section>
  );
}
