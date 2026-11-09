"use client";

import { useEffect, useMemo, useState } from "react";
import {
  migrationSeed,
  migrationStatuses,
  statusIndex,
  type MigrationStatus,
  type PermissionScope,
  type UserMigration,
} from "@/data/user-migration-seed";

type View = "dashboard" | "users" | "editor" | "mail" | "backup";

const storageKey = "la-bonne-branche-user-migration-v1";
const inputClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10";

function newScope(): PermissionScope {
  return {
    id: crypto.randomUUID(),
    url: "",
    reach: "Page précise",
    actions: "",
    notes: "",
  };
}

function newUser(): UserMigration {
  return {
    id: "",
    firstName: "",
    lastName: "",
    team: "",
    email: "",
    manager: "",
    status: "À contacter",
    notes: "",
    scopes: [],
    updatedAt: new Date().toISOString(),
  };
}

function isMigration(value: unknown): value is UserMigration {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<UserMigration>;
  return (
    typeof item.id === "string" &&
    typeof item.firstName === "string" &&
    typeof item.lastName === "string" &&
    typeof item.team === "string" &&
    typeof item.email === "string" &&
    migrationStatuses.includes(item.status as MigrationStatus) &&
    Array.isArray(item.scopes)
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusTone(status: MigrationStatus) {
  const index = statusIndex(status);
  if (index >= 7) return "bg-success/10 text-success";
  if (index >= 5) return "bg-primary/10 text-primary";
  if (index >= 2) return "bg-warning/10 text-warning";
  return "bg-danger/10 text-danger";
}

function csvCell(value: unknown) {
  const text =
    typeof value === "object" ? JSON.stringify(value) : String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export default function UserMigrationTool() {
  const [users, setUsers] = useState<UserMigration[]>(migrationSeed);
  const [hydrated, setHydrated] = useState(false);
  const [view, setView] = useState<View>("dashboard");
  const [editing, setEditing] = useState<UserMigration | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Tous" | MigrationStatus>(
    "Tous",
  );
  const [message, setMessage] = useState("");
  const [mail, setMail] = useState({ to: "", subject: "", body: "" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.every(isMigration)) setUsers(parsed);
      }
    } catch {
      // Les données fictives restent utilisées si la sauvegarde est illisible.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(storageKey, JSON.stringify(users));
  }, [hydrated, users]);

  const filtered = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("fr");
    return users.filter((user) => {
      const matchesSearch = [
        user.firstName,
        user.lastName,
        user.team,
        user.email,
        user.manager,
      ]
        .join(" ")
        .toLocaleLowerCase("fr")
        .includes(search);
      return (
        matchesSearch &&
        (statusFilter === "Tous" || user.status === statusFilter)
      );
    });
  }, [query, statusFilter, users]);

  const totals = {
    all: users.length,
    contacted: users.filter((user) => statusIndex(user.status) >= 2).length,
    validated: users.filter((user) => statusIndex(user.status) >= 5).length,
    created: users.filter((user) => statusIndex(user.status) >= 6).length,
    checked: users.filter((user) => statusIndex(user.status) >= 7).length,
  };

  function openNewUser() {
    setEditing(newUser());
    setView("editor");
    setMessage("");
  }

  function openUser(user: UserMigration) {
    setEditing(structuredClone(user));
    setView("editor");
    setMessage("");
  }

  function patchEditing(patch: Partial<UserMigration>) {
    if (editing) setEditing({ ...editing, ...patch });
  }

  function patchScope(id: string, patch: Partial<PermissionScope>) {
    if (!editing) return;
    patchEditing({
      scopes: editing.scopes.map((scope) =>
        scope.id === id ? { ...scope, ...patch } : scope,
      ),
    });
  }

  function saveUser(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (!editing) return null;
    if (!editing.firstName.trim() || !editing.lastName.trim()) {
      setMessage("Le prénom et le nom sont obligatoires.");
      return null;
    }
    if (editing.email && !editing.email.includes("@")) {
      setMessage("L’adresse e-mail n’est pas valide.");
      return null;
    }

    const saved: UserMigration = {
      ...editing,
      id: editing.id || crypto.randomUUID(),
      firstName: editing.firstName.trim(),
      lastName: editing.lastName.trim(),
      team: editing.team.trim(),
      email: editing.email.trim(),
      manager: editing.manager.trim(),
      notes: editing.notes.trim(),
      updatedAt: new Date().toISOString(),
      scopes: editing.scopes.filter(
        (scope) =>
          scope.url.trim() || scope.actions.trim() || scope.notes.trim(),
      ),
    };

    setUsers((current) =>
      editing.id
        ? current.map((user) => (user.id === editing.id ? saved : user))
        : [...current, saved],
    );
    setEditing(saved);
    setMessage("La fiche a été enregistrée.");
    return saved;
  }

  function removeUser() {
    if (!editing?.id) return;
    if (
      !confirm(
        `Supprimer définitivement la fiche de ${editing.firstName} ${editing.lastName} ?`,
      )
    )
      return;
    setUsers((current) => current.filter((user) => user.id !== editing.id));
    setEditing(null);
    setView("users");
    setMessage("La fiche a été supprimée.");
  }

  function prepareMail() {
    const user = saveUser();
    if (!user) return;
    const scopes =
      user.scopes.length > 0
        ? `\nPérimètres déjà identifiés à confirmer :\n${user.scopes
            .map(
              (scope) =>
                `- ${scope.url || "URL à préciser"} — ${scope.reach} — ${scope.actions || "actions à préciser"}`,
            )
            .join("\n")}\n`
        : "";

    setMail({
      to: user.email,
      subject: "Évolution de nos outils — confirmation de vos futurs accès",
      body: `Bonjour ${user.firstName},

Dans le cadre de l’évolution des outils de La Bonne Branche, nous préparons la reprise des comptes et des autorisations.

Merci de confirmer avec votre responsable :
- les pages ou rubriques sur lesquelles vous devez intervenir ;
- le périmètre nécessaire pour chaque espace ;
- les actions attendues : création, modification, publication ou validation ;
- les accès devenus inutiles qui doivent être retirés.
${scopes}
Ces demandes seront contrôlées avant toute attribution définitive des droits.

Merci pour votre retour.

L’équipe Projets numériques
La Bonne Branche`,
    });
    setView("mail");
  }

  async function copyMail() {
    const text = `À : ${mail.to}\nObjet : ${mail.subject}\n\n${mail.body}`;
    try {
      await navigator.clipboard.writeText(text);
      setMessage("Le courriel a été copié.");
    } catch {
      setMessage("Copie automatique impossible : sélectionnez le texte manuellement.");
    }
  }

  function openMailClient() {
    window.location.href = `mailto:${encodeURIComponent(mail.to)}?subject=${encodeURIComponent(mail.subject)}&body=${encodeURIComponent(mail.body)}`;
  }

  function download(name: string, content: string, type: string) {
    const href = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement("a");
    link.href = href;
    link.download = name;
    link.click();
    URL.revokeObjectURL(href);
  }

  function exportJson() {
    download(
      "la-bonne-branche-mutation-utilisateurs.json",
      JSON.stringify({ version: 1, users }, null, 2),
      "application/json",
    );
  }

  function exportCsv() {
    const keys: (keyof UserMigration)[] = [
      "lastName",
      "firstName",
      "team",
      "email",
      "manager",
      "status",
      "notes",
      "scopes",
      "updatedAt",
    ];
    const rows = users.map((user) =>
      keys.map((key) => csvCell(user[key])).join(";"),
    );
    download(
      "la-bonne-branche-mutation-utilisateurs.csv",
      "\ufeff" + keys.join(";") + "\n" + rows.join("\n"),
      "text/csv;charset=utf-8",
    );
  }

  async function importJson(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed: unknown = JSON.parse(await file.text());
      const imported =
        parsed &&
        typeof parsed === "object" &&
        "users" in parsed &&
        Array.isArray((parsed as { users: unknown }).users)
          ? (parsed as { users: unknown[] }).users
          : null;
      if (!imported || !imported.every(isMigration)) {
        throw new Error("Format de sauvegarde non reconnu.");
      }
      if (
        !confirm(
          `Remplacer les ${users.length} fiches locales par ${imported.length} fiches importées ?`,
        )
      )
        return;
      setUsers(imported);
      setMessage(`${imported.length} fiche(s) importée(s).`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Import impossible.");
    }
    event.target.value = "";
  }

  function resetDemo() {
    if (!confirm("Restaurer les données fictives initiales ?")) return;
    setUsers(migrationSeed);
    setMessage("Les données fictives ont été restaurées.");
  }

  const nav = (
    <nav className="flex flex-wrap gap-2 rounded-2xl border border-border bg-surface p-2 shadow-sm">
      {[
        ["dashboard", "Tableau de bord"],
        ["users", "Utilisateurs"],
        ["backup", "Sauvegardes"],
      ].map(([value, label]) => (
        <button
          key={value}
          type="button"
          onClick={() => {
            setView(value as View);
            setEditing(null);
            setMessage("");
          }}
          className={
            "rounded-xl px-4 py-2.5 text-sm font-semibold " +
            (view === value
              ? "bg-primary text-white"
              : "text-muted hover:bg-surface-muted hover:text-foreground")
          }
        >
          {label}
        </button>
      ))}
    </nav>
  );

  return (
    <section className="space-y-6">
      {nav}

      {message && (
        <p className="rounded-xl border border-primary/20 bg-accent-soft px-4 py-3 text-sm font-medium text-foreground">
          {message}
        </p>
      )}

      {view === "dashboard" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {[
              ["Utilisateurs", totals.all],
              ["Réponses reçues", totals.contacted],
              ["Droits validés", totals.validated],
              ["Comptes créés", totals.created],
              ["Accès vérifiés", totals.checked],
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

          <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Avancement de la reprise des accès
                </h2>
                <p className="mt-2 text-muted">
                  Chaque compte progresse de la prise de contact jusqu’au
                  contrôle des autorisations.
                </p>
              </div>
              <button
                type="button"
                onClick={openNewUser}
                className="rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-hover"
              >
                Ajouter un utilisateur
              </button>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-4">
              {migrationStatuses.map((status) => {
                const count = users.filter((user) => user.status === status).length;
                return (
                  <button
                    type="button"
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setView("users");
                    }}
                    className="rounded-xl border border-border bg-surface-muted p-4 text-left hover:border-primary"
                  >
                    <p className="text-2xl font-bold text-foreground">{count}</p>
                    <p className="mt-1 text-sm font-semibold text-muted">{status}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 h-3 overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-success transition-[width]"
                style={{
                  width: users.length
                    ? `${Math.round((totals.checked / users.length) * 100)}%`
                    : "0%",
                }}
              />
            </div>
            <p className="mt-2 text-right text-sm font-semibold text-muted">
              {users.length
                ? Math.round((totals.checked / users.length) * 100)
                : 0}
              % entièrement vérifiés
            </p>
          </article>
        </>
      )}

      {view === "users" && (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Utilisateurs à reprendre
              </h2>
              <p className="mt-1 text-muted">
                {filtered.length} fiche(s) affichée(s) sur {users.length}.
              </p>
            </div>
            <button
              type="button"
              onClick={openNewUser}
              className="rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-hover"
            >
              Ajouter un utilisateur
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className={inputClass}
                placeholder="Rechercher un utilisateur, une équipe ou un responsable"
              />
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as "Tous" | MigrationStatus,
                  )
                }
                className={inputClass}
              >
                <option>Tous</option>
                {migrationStatuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-surface-muted text-muted">
                  <tr>
                    <th className="px-5 py-4">Utilisateur</th>
                    <th className="px-5 py-4">Équipe</th>
                    <th className="px-5 py-4">Responsable</th>
                    <th className="px-5 py-4">Périmètres</th>
                    <th className="px-5 py-4">État</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((user) => (
                    <tr key={user.id} className="hover:bg-surface-muted/40">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-foreground">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="mt-1 text-muted">{user.email}</p>
                      </td>
                      <td className="px-5 py-4 text-foreground">{user.team || "—"}</td>
                      <td className="px-5 py-4 text-muted">{user.manager || "—"}</td>
                      <td className="px-5 py-4 text-foreground">{user.scopes.length}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => openUser(user)}
                          className="font-semibold text-primary hover:text-primary-hover"
                        >
                          Ouvrir la fiche
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!filtered.length && (
              <p className="p-10 text-center text-muted">
                Aucun utilisateur ne correspond aux filtres.
              </p>
            )}
          </div>
        </>
      )}

      {view === "editor" && editing && (
        <form onSubmit={saveUser} className="space-y-6">
          <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  {editing.id ? "Fiche utilisateur" : "Nouvel utilisateur"}
                </p>
                <h2 className="mt-1 text-2xl font-bold text-foreground">
                  {editing.firstName || editing.lastName
                    ? `${editing.firstName} ${editing.lastName}`
                    : "Identité et suivi"}
                </h2>
              </div>
              <button type="button" onClick={() => setView("users")} className="text-sm font-semibold text-muted hover:text-foreground">
                Retour à la liste
              </button>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="text-sm font-semibold text-foreground">
                Prénom *
                <input required value={editing.firstName} onChange={(e) => patchEditing({firstName:e.target.value})} className={`mt-2 ${inputClass}`} />
              </label>
              <label className="text-sm font-semibold text-foreground">
                Nom *
                <input required value={editing.lastName} onChange={(e) => patchEditing({lastName:e.target.value})} className={`mt-2 ${inputClass}`} />
              </label>
              <label className="text-sm font-semibold text-foreground">
                Équipe
                <input value={editing.team} onChange={(e) => patchEditing({team:e.target.value})} className={`mt-2 ${inputClass}`} />
              </label>
              <label className="text-sm font-semibold text-foreground">
                Adresse e-mail
                <input type="email" value={editing.email} onChange={(e) => patchEditing({email:e.target.value})} className={`mt-2 ${inputClass}`} />
              </label>
              <label className="text-sm font-semibold text-foreground">
                Responsable ou valideur
                <input value={editing.manager} onChange={(e) => patchEditing({manager:e.target.value})} className={`mt-2 ${inputClass}`} />
              </label>
              <label className="text-sm font-semibold text-foreground">
                État d’avancement
                <select value={editing.status} onChange={(e) => patchEditing({status:e.target.value as MigrationStatus})} className={`mt-2 ${inputClass}`}>
                  {migrationStatuses.map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
              <label className="text-sm font-semibold text-foreground md:col-span-2">
                Notes internes
                <textarea rows={4} value={editing.notes} onChange={(e) => patchEditing({notes:e.target.value})} className={`mt-2 ${inputClass}`} />
              </label>
            </div>
          </article>

          <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Périmètres et autorisations
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Une ligne par page, rubrique ou branche concernée.
                </p>
              </div>
              <button
                type="button"
                onClick={() => patchEditing({scopes:[...editing.scopes,newScope()]})}
                className="rounded-xl border border-primary px-4 py-2.5 font-semibold text-primary hover:bg-primary hover:text-white"
              >
                Ajouter un périmètre
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {editing.scopes.map((scope, index) => (
                <section key={scope.id} className="rounded-2xl border border-border bg-surface-muted p-5">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="font-bold text-foreground">Périmètre {index + 1}</h4>
                    <button type="button" onClick={() => patchEditing({scopes:editing.scopes.filter((item) => item.id !== scope.id)})} className="text-sm font-semibold text-danger">Retirer</button>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="text-sm font-semibold text-foreground md:col-span-2">
                      URL de référence
                      <input type="url" value={scope.url} onChange={(e) => patchScope(scope.id,{url:e.target.value})} placeholder="https://www.la-bonne-branche.example/..." className={`mt-2 ${inputClass}`} />
                    </label>
                    <label className="text-sm font-semibold text-foreground">
                      Portée
                      <select value={scope.reach} onChange={(e) => patchScope(scope.id,{reach:e.target.value as PermissionScope["reach"]})} className={`mt-2 ${inputClass}`}>
                        <option>Page précise</option><option>Rubrique</option><option>Branche et descendants</option><option>Site complet</option>
                      </select>
                    </label>
                    <label className="text-sm font-semibold text-foreground">
                      Actions autorisées
                      <input value={scope.actions} onChange={(e) => patchScope(scope.id,{actions:e.target.value})} placeholder="Créer, modifier, publier…" className={`mt-2 ${inputClass}`} />
                    </label>
                    <label className="text-sm font-semibold text-foreground md:col-span-2">
                      Observations
                      <input value={scope.notes} onChange={(e) => patchScope(scope.id,{notes:e.target.value})} className={`mt-2 ${inputClass}`} />
                    </label>
                  </div>
                </section>
              ))}
              {!editing.scopes.length && (
                <p className="rounded-xl bg-surface-muted p-6 text-center text-muted">
                  Aucun périmètre enregistré.
                </p>
              )}
            </div>
          </article>

          <div className="flex flex-wrap gap-3">
            <button className="rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-hover">
              Enregistrer la fiche
            </button>
            <button type="button" onClick={prepareMail} className="rounded-xl border border-primary px-5 py-3 font-semibold text-primary hover:bg-primary hover:text-white">
              Préparer le courriel
            </button>
            {editing.id && (
              <button type="button" onClick={removeUser} className="rounded-xl px-5 py-3 font-semibold text-danger hover:bg-danger/10">
                Supprimer
              </button>
            )}
          </div>
        </form>
      )}

      {view === "mail" && (
        <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground">Courriel personnalisé</h2>
          <p className="mt-2 text-muted">
            Le texte reste modifiable. Aucun envoi automatique n’est effectué.
          </p>
          <div className="mt-6 space-y-5">
            <label className="block text-sm font-semibold text-foreground">
              Destinataire
              <input value={mail.to} onChange={(e) => setMail({...mail,to:e.target.value})} className={`mt-2 ${inputClass}`} />
            </label>
            <label className="block text-sm font-semibold text-foreground">
              Objet
              <input value={mail.subject} onChange={(e) => setMail({...mail,subject:e.target.value})} className={`mt-2 ${inputClass}`} />
            </label>
            <label className="block text-sm font-semibold text-foreground">
              Message
              <textarea rows={18} value={mail.body} onChange={(e) => setMail({...mail,body:e.target.value})} className={`mt-2 ${inputClass}`} />
            </label>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={copyMail} className="rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-hover">Copier le courriel</button>
            <button type="button" onClick={openMailClient} className="rounded-xl border border-primary px-5 py-3 font-semibold text-primary hover:bg-primary hover:text-white">Ouvrir la messagerie</button>
            <button type="button" onClick={() => setView("editor")} className="rounded-xl border border-border px-5 py-3 font-semibold text-foreground hover:bg-surface-muted">Retour à la fiche</button>
          </div>
        </article>
      )}

      {view === "backup" && (
        <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground">Sauvegarde locale</h2>
          <p className="mt-2 max-w-3xl leading-7 text-muted">
            Les fiches sont stockées uniquement dans ce navigateur. L’export
            permet de conserver une copie ou de poursuivre la démonstration sur
            un autre poste.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={exportJson} className="rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-hover">Exporter en JSON</button>
            <button type="button" onClick={exportCsv} className="rounded-xl border border-primary px-5 py-3 font-semibold text-primary hover:bg-primary hover:text-white">Exporter en CSV</button>
            <label className="cursor-pointer rounded-xl border border-border px-5 py-3 font-semibold text-foreground hover:bg-surface-muted">
              Importer un JSON
              <input type="file" accept="application/json" onChange={importJson} className="sr-only" />
            </label>
            <button type="button" onClick={resetDemo} className="rounded-xl px-5 py-3 font-semibold text-danger hover:bg-danger/10">Réinitialiser la démo</button>
          </div>
        </article>
      )}
    </section>
  );
}
