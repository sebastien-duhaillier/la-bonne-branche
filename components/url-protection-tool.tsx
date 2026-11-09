"use client";

import { useEffect, useMemo, useState } from "react";
import {
  protectedUrlSeed,
  ruleTypeLabels,
  type ProtectedUrlRule,
  type ProtectionRuleType,
} from "@/data/protected-url-seed";

type Tab = "check" | "rules" | "updates";
type FormState = {
  url: string;
  service: string;
  requester: string;
  type: ProtectionRuleType;
  reason: string;
};

const storageKey = "la-bonne-branche-protected-urls-v1";
const emptyForm: FormState = {
  url: "",
  service: "",
  requester: "",
  type: "page",
  reason: "",
};

const inputClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10";

function normalizeUrl(value: string) {
  const parsed = new URL(value.trim());
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("L’adresse doit commencer par http:// ou https://.");
  }
  parsed.hash = "";
  parsed.search = "";
  const pathname = parsed.pathname.replace(/\/+$/, "") || "/";
  return `${parsed.protocol}//${parsed.host}${pathname}`;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getProtection(url: string, rules: ProtectedUrlRule[]) {
  const active = rules.filter((rule) => !rule.revokedAt);
  const exception = active.find(
    (rule) => rule.type === "exception" && rule.url === url,
  );
  if (exception) {
    return {
      tone: "warning",
      title: "Exception individuelle",
      detail:
        "Cette URL est exclue d’une protection héritée. Un contrôle humain reste nécessaire.",
      matches: [exception],
    };
  }

  const direct = active.filter(
    (rule) => rule.type === "page" && rule.url === url,
  );
  if (direct.length) {
    return {
      tone: "success",
      title: "URL protégée directement",
      detail: "Une règle vise précisément cette page.",
      matches: direct,
    };
  }

  const inherited = active.filter((rule) => {
    if (rule.type !== "branch") return false;
    const prefix = rule.url.endsWith("/") ? rule.url : `${rule.url}/`;
    return url === rule.url || url.startsWith(prefix);
  });
  if (inherited.length) {
    return {
      tone: "success",
      title: "URL protégée par héritage",
      detail: "Cette page appartient à une branche protégée.",
      matches: inherited,
    };
  }

  return {
    tone: "neutral",
    title: "URL non répertoriée",
    detail: "Aucune règle active ne couvre cette adresse.",
    matches: [] as ProtectedUrlRule[],
  };
}

function isRule(value: unknown): value is ProtectedUrlRule {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<ProtectedUrlRule>;
  return (
    typeof item.id === "string" &&
    typeof item.url === "string" &&
    typeof item.service === "string" &&
    typeof item.requester === "string" &&
    ["page", "branch", "exception"].includes(item.type ?? "") &&
    typeof item.reason === "string" &&
    typeof item.createdAt === "string"
  );
}

export default function UrlProtectionTool() {
  const [tab, setTab] = useState<Tab>("check");
  const [rules, setRules] = useState<ProtectedUrlRule[]>(protectedUrlSeed);
  const [hydrated, setHydrated] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showBatch, setShowBatch] = useState(false);
  const [batchUrls, setBatchUrls] = useState("");
  const [batchDefaults, setBatchDefaults] = useState({
    service: "",
    requester: "",
    type: "page" as ProtectionRuleType,
    reason: "",
  });
  const [query, setQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [checkUrl, setCheckUrl] = useState(
    "https://www.la-bonne-branche.example/solutions/relation-client",
  );
  const [checkedUrl, setCheckedUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.every(isRule)) setRules(parsed);
      }
    } catch {
      // Les données de démonstration restent disponibles si le stockage est illisible.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(storageKey, JSON.stringify(rules));
    }
  }, [hydrated, rules]);

  const activeRules = useMemo(
    () => rules.filter((rule) => !rule.revokedAt),
    [rules],
  );

  const services = useMemo(
    () => [...new Set(rules.map((rule) => rule.service))].sort(),
    [rules],
  );

  const filteredRules = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("fr");
    return rules.filter((rule) => {
      const matchesQuery = [rule.url, rule.service, rule.requester, rule.reason]
        .join(" ")
        .toLocaleLowerCase("fr")
        .includes(normalized);
      const matchesService =
        serviceFilter === "Tous" || rule.service === serviceFilter;
      const matchesStatus =
        statusFilter === "Tous" ||
        (statusFilter === "Actives" && !rule.revokedAt) ||
        (statusFilter === "Révoquées" && Boolean(rule.revokedAt));
      return matchesQuery && matchesService && matchesStatus;
    });
  }, [query, rules, serviceFilter, statusFilter]);

  const checkedResult = useMemo(
    () => (checkedUrl ? getProtection(checkedUrl, rules) : null),
    [checkedUrl, rules],
  );

  const updateRules = useMemo(
    () =>
      activeRules
        .filter((rule) => rule.type !== "exception")
        .filter((rule) =>
          [rule.url, rule.service, rule.requester]
            .join(" ")
            .toLocaleLowerCase("fr")
            .includes(query.trim().toLocaleLowerCase("fr")),
        ),
    [activeRules, query],
  );

  function submitCheck(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    try {
      setCheckedUrl(normalizeUrl(checkUrl));
    } catch (error) {
      setCheckedUrl(null);
      setMessage(error instanceof Error ? error.message : "URL invalide.");
    }
  }

  function saveRule(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const url = normalizeUrl(form.url);
      if (!form.service.trim() || !form.requester.trim()) {
        throw new Error("Le service et le contact sont obligatoires.");
      }

      if (editingId) {
        setRules((current) =>
          current.map((rule) =>
            rule.id === editingId
              ? {
                  ...rule,
                  ...form,
                  url,
                  service: form.service.trim(),
                  requester: form.requester.trim(),
                  reason: form.reason.trim(),
                }
              : rule,
          ),
        );
        setMessage("La règle a été modifiée.");
      } else {
        const duplicate = activeRules.some(
          (rule) =>
            rule.url === url &&
            rule.type === form.type &&
            rule.service.toLocaleLowerCase("fr") ===
              form.service.trim().toLocaleLowerCase("fr"),
        );
        if (duplicate) {
          throw new Error(
            "Une règle active identique existe déjà pour ce service.",
          );
        }
        setRules((current) => [
          {
            id: crypto.randomUUID(),
            url,
            service: form.service.trim(),
            requester: form.requester.trim(),
            type: form.type,
            reason: form.reason.trim(),
            createdAt: new Date().toISOString(),
            revokedAt: null,
            isUpdated: false,
            updatedAt: null,
          },
          ...current,
        ]);
        setMessage("La règle a été enregistrée.");
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Enregistrement impossible.");
    }
  }

  function editRule(rule: ProtectedUrlRule) {
    setForm({
      url: rule.url,
      service: rule.service,
      requester: rule.requester,
      type: rule.type,
      reason: rule.reason,
    });
    setEditingId(rule.id);
    setShowForm(true);
    setShowBatch(false);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function revokeRule(rule: ProtectedUrlRule) {
    if (
      !window.confirm(
        `Révoquer la règle « ${rule.url} » ? Elle restera visible dans l’historique.`,
      )
    )
      return;
    setRules((current) =>
      current.map((item) =>
        item.id === rule.id
          ? { ...item, revokedAt: new Date().toISOString() }
          : item,
      ),
    );
  }

  function restoreRule(id: string) {
    setRules((current) =>
      current.map((rule) =>
        rule.id === id ? { ...rule, revokedAt: null } : rule,
      ),
    );
  }

  function addBatch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    try {
      const lines = batchUrls
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      if (!lines.length) throw new Error("Ajoutez au moins une URL.");
      if (lines.length > 50) throw new Error("Le lot est limité à 50 URL.");
      if (!batchDefaults.service.trim() || !batchDefaults.requester.trim()) {
        throw new Error("Le service et le contact sont obligatoires.");
      }

      const normalized = [...new Set(lines.map(normalizeUrl))];
      const existing = new Set(
        activeRules.map(
          (rule) =>
            `${rule.url}|${rule.type}|${rule.service.toLocaleLowerCase("fr")}`,
        ),
      );
      const fresh = normalized.filter(
        (url) =>
          !existing.has(
            `${url}|${batchDefaults.type}|${batchDefaults.service
              .trim()
              .toLocaleLowerCase("fr")}`,
          ),
      );
      const now = new Date().toISOString();
      setRules((current) => [
        ...fresh.map((url) => ({
          id: crypto.randomUUID(),
          url,
          service: batchDefaults.service.trim(),
          requester: batchDefaults.requester.trim(),
          type: batchDefaults.type,
          reason: batchDefaults.reason.trim(),
          createdAt: now,
          revokedAt: null,
          isUpdated: false,
          updatedAt: null,
        })),
        ...current,
      ]);
      setMessage(
        `${fresh.length} règle(s) ajoutée(s). ${normalized.length - fresh.length} doublon(s) ignoré(s).`,
      );
      setBatchUrls("");
      setShowBatch(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Import impossible.");
    }
  }

  function toggleUpdated(id: string, value: boolean) {
    setRules((current) =>
      current.map((rule) =>
        rule.id === id
          ? {
              ...rule,
              isUpdated: value,
              updatedAt: value ? new Date().toISOString() : null,
            }
          : rule,
      ),
    );
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(rules, null, 2)], {
      type: "application/json",
    });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "la-bonne-branche-regles-url.json";
    link.click();
    URL.revokeObjectURL(href);
  }

  async function importJson(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!Array.isArray(parsed) || !parsed.every(isRule)) {
        throw new Error("Le fichier ne contient pas des règles valides.");
      }
      setRules(parsed);
      setMessage(`${parsed.length} règle(s) importée(s).`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Fichier invalide.");
    }
    event.target.value = "";
  }

  function resetDemo() {
    if (!window.confirm("Réinitialiser toutes les données de cette démonstration ?"))
      return;
    setRules(protectedUrlSeed);
    setMessage("Les données fictives ont été restaurées.");
  }

  const updatedCount = activeRules.filter(
    (rule) => rule.type !== "exception" && rule.isUpdated,
  ).length;
  const trackedCount = activeRules.filter(
    (rule) => rule.type !== "exception",
  ).length;

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Règles actives", activeRules.length],
          ["Branches protégées", activeRules.filter((rule) => rule.type === "branch").length],
          ["Contenus vérifiés", `${updatedCount} / ${trackedCount}`],
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

      <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-surface p-2 shadow-sm">
        {[
          ["check", "Vérifier une URL"],
          ["rules", "Gérer les règles"],
          ["updates", "Suivre les mises à jour"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setTab(value as Tab);
              setQuery("");
              setMessage("");
            }}
            className={
              "rounded-xl px-4 py-2.5 text-sm font-semibold " +
              (tab === value
                ? "bg-primary text-white"
                : "text-muted hover:bg-surface-muted hover:text-foreground")
            }
          >
            {label}
          </button>
        ))}
      </div>

      {message && (
        <p className="rounded-xl border border-primary/20 bg-accent-soft px-4 py-3 text-sm font-medium text-foreground">
          {message}
        </p>
      )}

      {tab === "check" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
          <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground">Contrôler une adresse</h2>
            <p className="mt-2 leading-7 text-muted">
              Testez une URL fictive pour savoir si elle est protégée directement,
              par une branche parente ou exclue par une exception.
            </p>
            <form onSubmit={submitCheck} className="mt-6 space-y-4">
              <label className="block text-sm font-semibold text-foreground" htmlFor="check-url">
                URL à vérifier
              </label>
              <input
                id="check-url"
                type="url"
                required
                value={checkUrl}
                onChange={(event) => setCheckUrl(event.target.value)}
                className={inputClass}
              />
              <button className="rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-hover">
                Vérifier la protection
              </button>
            </form>
          </article>

          <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">Résultat</h2>
            {!checkedResult ? (
              <p className="mt-5 text-muted">Lancez une vérification pour afficher le diagnostic.</p>
            ) : (
              <div className="mt-5">
                <span
                  className={
                    "inline-flex rounded-full px-3 py-1 text-xs font-semibold " +
                    (checkedResult.tone === "success"
                      ? "bg-success/10 text-success"
                      : checkedResult.tone === "warning"
                        ? "bg-warning/10 text-warning"
                        : "bg-surface-muted text-muted")
                  }
                >
                  {checkedResult.title}
                </span>
                <p className="mt-4 leading-7 text-muted">{checkedResult.detail}</p>
                {checkedResult.matches.map((rule) => (
                  <div key={rule.id} className="mt-4 rounded-xl bg-surface-muted p-4 text-sm">
                    <p className="font-semibold text-foreground">{rule.service}</p>
                    <p className="mt-1 break-all text-muted">{rule.url}</p>
                    <p className="mt-1 text-muted">{ruleTypeLabels[rule.type]} · {rule.requester}</p>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>
      )}

      {tab === "rules" && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Registre des protections</h2>
              <p className="mt-1 text-muted">Les révocations restent dans l’historique.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm((value) => !value);
                  setShowBatch(false);
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                className="rounded-xl bg-primary px-4 py-2.5 font-semibold text-white hover:bg-primary-hover"
              >
                Ajouter une règle
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowBatch((value) => !value);
                  setShowForm(false);
                }}
                className="rounded-xl border border-primary px-4 py-2.5 font-semibold text-primary hover:bg-primary hover:text-white"
              >
                Ajouter plusieurs URL
              </button>
            </div>
          </div>

          {showForm && (
            <form onSubmit={saveRule} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="text-xl font-bold text-foreground">
                {editingId ? "Modifier la règle" : "Nouvelle règle"}
              </h3>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <label className="text-sm font-semibold text-foreground md:col-span-2">
                  URL *
                  <input type="url" required value={form.url} onChange={(e) => setForm({...form, url:e.target.value})} className={`mt-2 ${inputClass}`} placeholder="https://www.la-bonne-branche.example/..." />
                </label>
                <label className="text-sm font-semibold text-foreground">
                  Service responsable *
                  <input required value={form.service} onChange={(e) => setForm({...form, service:e.target.value})} className={`mt-2 ${inputClass}`} />
                </label>
                <label className="text-sm font-semibold text-foreground">
                  Contact *
                  <input required value={form.requester} onChange={(e) => setForm({...form, requester:e.target.value})} className={`mt-2 ${inputClass}`} />
                </label>
                <label className="text-sm font-semibold text-foreground">
                  Type de règle *
                  <select value={form.type} onChange={(e) => setForm({...form, type:e.target.value as ProtectionRuleType})} className={`mt-2 ${inputClass}`}>
                    {Object.entries(ruleTypeLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                <label className="text-sm font-semibold text-foreground">
                  Motif
                  <input value={form.reason} onChange={(e) => setForm({...form, reason:e.target.value})} className={`mt-2 ${inputClass}`} />
                </label>
              </div>
              <div className="mt-5 flex gap-3">
                <button className="rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-hover">
                  {editingId ? "Enregistrer les modifications" : "Enregistrer la règle"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-border px-5 py-3 font-semibold text-foreground hover:bg-surface-muted">Annuler</button>
              </div>
            </form>
          )}

          {showBatch && (
            <form onSubmit={addBatch} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="text-xl font-bold text-foreground">Ajout par lot</h3>
              <p className="mt-1 text-sm text-muted">Une URL par ligne, 50 maximum. Les autres informations sont communes au lot.</p>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <label className="text-sm font-semibold text-foreground md:col-span-2">
                  Liste des URL *
                  <textarea required rows={6} value={batchUrls} onChange={(e) => setBatchUrls(e.target.value)} className={`mt-2 ${inputClass}`} placeholder={"https://www.la-bonne-branche.example/services/conseil\nhttps://www.la-bonne-branche.example/services/audit"} />
                </label>
                <label className="text-sm font-semibold text-foreground">Service *<input required value={batchDefaults.service} onChange={(e) => setBatchDefaults({...batchDefaults,service:e.target.value})} className={`mt-2 ${inputClass}`} /></label>
                <label className="text-sm font-semibold text-foreground">Contact *<input required value={batchDefaults.requester} onChange={(e) => setBatchDefaults({...batchDefaults,requester:e.target.value})} className={`mt-2 ${inputClass}`} /></label>
                <label className="text-sm font-semibold text-foreground">Type<select value={batchDefaults.type} onChange={(e) => setBatchDefaults({...batchDefaults,type:e.target.value as ProtectionRuleType})} className={`mt-2 ${inputClass}`}>{Object.entries(ruleTypeLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                <label className="text-sm font-semibold text-foreground">Motif<input value={batchDefaults.reason} onChange={(e) => setBatchDefaults({...batchDefaults,reason:e.target.value})} className={`mt-2 ${inputClass}`} /></label>
              </div>
              <button className="mt-5 rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-hover">Importer le lot</button>
            </form>
          )}

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[1fr_220px_180px]">
              <input value={query} onChange={(e) => setQuery(e.target.value)} className={inputClass} placeholder="Rechercher une URL, un service ou un contact" />
              <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className={inputClass}><option>Tous</option>{services.map((service) => <option key={service}>{service}</option>)}</select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputClass}><option>Tous</option><option>Actives</option><option>Révoquées</option></select>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="bg-surface-muted text-muted"><tr><th className="px-5 py-4">URL</th><th className="px-5 py-4">Responsable</th><th className="px-5 py-4">Type</th><th className="px-5 py-4">Enregistrement</th><th className="px-5 py-4">Statut</th><th className="px-5 py-4">Actions</th></tr></thead>
                <tbody className="divide-y divide-border">
                  {filteredRules.map((rule) => (
                    <tr key={rule.id} className="align-top hover:bg-surface-muted/40">
                      <td className="px-5 py-4"><p className="max-w-md break-all font-semibold text-foreground">{rule.url}</p><p className="mt-1 text-muted">{rule.reason || "Aucun motif renseigné"}</p></td>
                      <td className="px-5 py-4"><p className="font-semibold text-foreground">{rule.service}</p><p className="mt-1 text-muted">{rule.requester}</p></td>
                      <td className="px-5 py-4 text-foreground">{ruleTypeLabels[rule.type]}</td>
                      <td className="px-5 py-4 text-muted">{formatDate(rule.createdAt)}</td>
                      <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${rule.revokedAt ? "bg-surface-muted text-muted" : "bg-success/10 text-success"}`}>{rule.revokedAt ? "Révoquée" : "Active"}</span></td>
                      <td className="px-5 py-4"><div className="flex gap-3">{rule.revokedAt ? <button onClick={() => restoreRule(rule.id)} className="font-semibold text-primary hover:text-primary-hover">Restaurer</button> : <><button onClick={() => editRule(rule)} className="font-semibold text-primary hover:text-primary-hover">Modifier</button><button onClick={() => revokeRule(rule)} className="font-semibold text-danger">Révoquer</button></>}</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!filteredRules.length && <p className="p-10 text-center text-muted">Aucune règle ne correspond aux filtres.</p>}
          </div>

          <div className="flex flex-wrap gap-3 rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <button type="button" onClick={exportJson} className="rounded-xl border border-primary px-4 py-2.5 font-semibold text-primary hover:bg-primary hover:text-white">Exporter en JSON</button>
            <label className="cursor-pointer rounded-xl border border-border px-4 py-2.5 font-semibold text-foreground hover:bg-surface-muted">
              Importer un JSON
              <input type="file" accept="application/json" onChange={importJson} className="sr-only" />
            </label>
            <button type="button" onClick={resetDemo} className="rounded-xl px-4 py-2.5 font-semibold text-danger hover:bg-danger/10">Réinitialiser la démo</button>
          </div>
        </>
      )}

      {tab === "updates" && (
        <>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Suivi des contenus conservés</h2>
            <p className="mt-2 text-muted">{updatedCount} contenu(s) vérifié(s), {trackedCount - updatedCount} restant à contrôler.</p>
          </div>
          <input value={query} onChange={(e) => setQuery(e.target.value)} className={inputClass} placeholder="Filtrer par URL, service ou contact" />
          <div className="grid gap-4">
            {updateRules.map((rule) => (
              <article key={rule.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <p className="break-all font-semibold text-foreground">{rule.url}</p>
                  <p className="mt-1 text-sm text-muted">{rule.service} · {rule.requester} · {ruleTypeLabels[rule.type]}</p>
                  <p className="mt-1 text-xs text-muted">Dernière vérification : {formatDate(rule.updatedAt)}</p>
                </div>
                <label className={`flex shrink-0 cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${rule.isUpdated ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                  <input type="checkbox" checked={rule.isUpdated} onChange={(e) => toggleUpdated(rule.id, e.target.checked)} className="size-5 accent-[var(--success)]" />
                  {rule.isUpdated ? "Contenu vérifié" : "À vérifier"}
                </label>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
