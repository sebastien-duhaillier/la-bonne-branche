"use client";

import { useEffect, useMemo, useState } from "react";
import {
  branchOptions,
  currentTree,
  proposedTree,
  simulatorExamples,
  type ChangeKind,
  type SiteTreeNode,
} from "@/data/site-tree";

type ViewMode = "comparison" | "simulator";
type TreeVersion = "Actuelle" | "Préconisée";

type FlatNode = {
  node: SiteTreeNode;
  depth: number;
};

type SelectedNode = {
  node: SiteTreeNode;
  version: TreeVersion;
};

const changeStyles: Record<ChangeKind, string> = {
  Identique: "bg-surface-muted text-muted",
  Déplacé: "bg-warning/10 text-warning",
  Renommé: "bg-secondary/15 text-secondary",
  Fusionné: "bg-primary/10 text-primary",
  Ajouté: "bg-success/10 text-success",
  Supprimé: "bg-danger/10 text-danger",
};

const stopWords = new Set([
  "avec",
  "comment",
  "dans",
  "des",
  "les",
  "mon",
  "pour",
  "que",
  "qui",
  "une",
  "veux",
]);

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr");
}

function flattenTree(
  node: SiteTreeNode,
  depth = 0,
): FlatNode[] {
  return [
    { node, depth },
    ...(node.children?.flatMap((child) =>
      flattenTree(child, depth + 1),
    ) ?? []),
  ];
}

function collectBranchIds(node: SiteTreeNode): string[] {
  return [
    ...(node.children?.length ? [node.id] : []),
    ...(node.children?.flatMap(collectBranchIds) ?? []),
  ];
}

function getVisibleIds(
  node: SiteTreeNode,
  search: string,
  branch: string,
  onlyChanges: boolean,
  maximumDepth: number,
  depth: number,
  result: Set<string>,
): boolean {
  if (depth > maximumDepth) {
    return false;
  }

  const normalizedSearch = normalize(search.trim());
  const haystack = normalize(
    [
      node.label,
      node.path,
      node.owner,
      node.description,
      ...node.keywords,
    ].join(" "),
  );

  const matchesSearch =
    normalizedSearch.length === 0 ||
    normalizedSearch
      .split(/\s+/)
      .filter(Boolean)
      .every((word) => haystack.includes(word));

  const matchesBranch =
    branch === "all" ||
    node.group === branch ||
    node.id === "root";

  const matchesChange =
    !onlyChanges || node.change !== "Identique";

  let childMatches = false;

  for (const child of node.children ?? []) {
    if (
      getVisibleIds(
        child,
        search,
        branch,
        onlyChanges,
        maximumDepth,
        depth + 1,
        result,
      )
    ) {
      childMatches = true;
    }
  }

  if (
    (matchesSearch && matchesBranch && matchesChange) ||
    childMatches
  ) {
    result.add(node.id);
    return true;
  }

  return false;
}

function getSearchResults(
  tree: SiteTreeNode,
  query: string,
): FlatNode[] {
  const words = normalize(query)
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

  if (words.length === 0) {
    return [];
  }

  return flattenTree(tree)
    .map((item) => {
      const haystack = normalize(
        [
          item.node.label,
          item.node.path,
          item.node.description,
          ...item.node.keywords,
        ].join(" "),
      );

      const score = words.reduce((total, word) => {
        const stem = word.length > 5 ? word.slice(0, 5) : word;
        return total +
          (haystack.includes(word) || haystack.includes(stem) ? 1 : 0);
      }, 0);

      return { ...item, score };
    })
    .filter((item) => item.score > 0)
    .sort((first, second) => {
      if (second.score !== first.score) {
        return second.score - first.score;
      }

      return first.depth - second.depth;
    })
    .slice(0, 4)
    .map(({ node, depth }) => ({ node, depth }));
}

type TreeBranchProps = {
  node: SiteTreeNode;
  depth: number;
  version: TreeVersion;
  expandedIds: Set<string>;
  visibleIds: Set<string>;
  forceOpen: boolean;
  onToggle: (id: string) => void;
  onSelect: (selection: SelectedNode) => void;
};

function TreeBranch({
  node,
  depth,
  version,
  expandedIds,
  visibleIds,
  forceOpen,
  onToggle,
  onSelect,
}: TreeBranchProps) {
  if (!visibleIds.has(node.id)) {
    return null;
  }

  const hasVisibleChildren = Boolean(
    node.children?.some((child) => visibleIds.has(child.id)),
  );
  const isOpen = forceOpen || expandedIds.has(node.id);

  return (
    <div>
      <div
        className="flex items-start gap-2 rounded-xl border border-transparent px-2 py-2 hover:border-border hover:bg-surface-muted"
        style={{ marginLeft: depth * 17 }}
      >
        <button
          type="button"
          onClick={() => hasVisibleChildren && onToggle(node.id)}
          className={
            "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg text-sm " +
            (hasVisibleChildren
              ? "bg-surface text-primary hover:bg-border"
              : "cursor-default text-muted")
          }
          aria-label={
            hasVisibleChildren
              ? (isOpen ? "Fermer " : "Ouvrir ") + node.label
              : undefined
          }
        >
          {hasVisibleChildren ? (isOpen ? "−" : "+") : "•"}
        </button>

        <button
          type="button"
          onClick={() => onSelect({ node, version })}
          className="min-w-0 flex-1 text-left"
        >
          <span className="block font-semibold text-foreground">
            {node.label}
          </span>
          <span className="mt-0.5 block break-all text-xs text-muted">
            {node.path}
          </span>
          <span className="mt-1 block text-xs text-muted">
            Responsable : {node.owner}
          </span>
        </button>

        <span
          className={
            "hidden shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold sm:inline-flex " +
            changeStyles[node.change]
          }
        >
          {node.change}
        </span>
      </div>

      {hasVisibleChildren && isOpen && (
        <div className="border-l border-border/70">
          {node.children?.map((child) => (
            <TreeBranch
              key={child.id}
              node={child}
              depth={depth + 1}
              version={version}
              expandedIds={expandedIds}
              visibleIds={visibleIds}
              forceOpen={forceOpen}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type TreePanelProps = {
  title: string;
  subtitle: string;
  tree: SiteTreeNode;
  version: TreeVersion;
  visibleIds: Set<string>;
  expandedIds: Set<string>;
  forceOpen: boolean;
  onToggle: (id: string) => void;
  onSelect: (selection: SelectedNode) => void;
  accentClassName: string;
};

function TreePanel({
  title,
  subtitle,
  tree,
  version,
  visibleIds,
  expandedIds,
  forceOpen,
  onToggle,
  onSelect,
  accentClassName,
}: TreePanelProps) {
  const visibleCount = flattenTree(tree).filter((item) =>
    visibleIds.has(item.node.id),
  ).length;

  return (
    <section className="min-w-0 rounded-2xl border border-border bg-surface shadow-sm">
      <header className="border-b border-border p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div
              className={
                "mb-3 h-1.5 w-14 rounded-full " + accentClassName
              }
            />
            <h2 className="text-xl font-bold text-foreground">
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted">{subtitle}</p>
          </div>
          <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-muted">
            {visibleCount} éléments
          </span>
        </div>
      </header>

      <div className="max-h-[680px] overflow-auto p-3 sm:p-5">
        {visibleCount > 0 ? (
          <TreeBranch
            node={tree}
            depth={0}
            version={version}
            expandedIds={expandedIds}
            visibleIds={visibleIds}
            forceOpen={forceOpen}
            onToggle={onToggle}
            onSelect={onSelect}
          />
        ) : (
          <div className="rounded-xl bg-surface-muted p-8 text-center">
            <p className="font-semibold text-foreground">
              Aucun élément visible
            </p>
            <p className="mt-1 text-sm text-muted">
              Modifiez les filtres de comparaison.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

type SimulatorResultsProps = {
  title: string;
  subtitle: string;
  results: FlatNode[];
  accentClassName: string;
};

function SimulatorResults({
  title,
  subtitle,
  results,
  accentClassName,
}: SimulatorResultsProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className={"mb-4 h-1.5 w-14 rounded-full " + accentClassName} />
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted">{subtitle}</p>

      <div className="mt-6 space-y-3">
        {results.length > 0 ? (
          results.map(({ node, depth }, index) => (
            <article
              key={node.id}
              className="rounded-xl border border-border p-4"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-primary">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">
                    {node.label}
                  </p>
                  <p className="mt-1 break-all font-mono text-xs text-primary">
                    {node.path}
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    Niveau {depth + 1} · {node.owner}
                  </p>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-xl bg-surface-muted p-8 text-center">
            <p className="font-semibold text-foreground">
              Aucun parcours identifié
            </p>
            <p className="mt-1 text-sm text-muted">
              Décrivez le besoin avec quelques mots précis.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function SiteTreeViewer() {
  const allBranchIds = useMemo(
    () =>
      Array.from(
        new Set([
          ...collectBranchIds(currentTree),
          ...collectBranchIds(proposedTree),
        ]),
      ),
    [],
  );

  const currentNodes = useMemo(
    () => flattenTree(currentTree),
    [],
  );
  const proposedNodes = useMemo(
    () => flattenTree(proposedTree),
    [],
  );

  const [mode, setMode] = useState<ViewMode>("comparison");
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("all");
  const [maximumDepth, setMaximumDepth] = useState(4);
  const [onlyChanges, setOnlyChanges] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [expandedIds, setExpandedIds] = useState(
    () => new Set(allBranchIds),
  );
  const [selected, setSelected] = useState<SelectedNode | null>(null);
  const [simulatorQuery, setSimulatorQuery] = useState(
    simulatorExamples[0],
  );

  useEffect(() => {
    if (!fullScreen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeWithEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setFullScreen(false);
      }
    }

    window.addEventListener("keydown", closeWithEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [fullScreen]);

  const currentVisibleIds = useMemo(() => {
    const result = new Set<string>();
    getVisibleIds(
      currentTree,
      search,
      branch,
      onlyChanges,
      maximumDepth,
      0,
      result,
    );
    return result;
  }, [search, branch, onlyChanges, maximumDepth]);

  const proposedVisibleIds = useMemo(() => {
    const result = new Set<string>();
    getVisibleIds(
      proposedTree,
      search,
      branch,
      onlyChanges,
      maximumDepth,
      0,
      result,
    );
    return result;
  }, [search, branch, onlyChanges, maximumDepth]);

  const currentResults = useMemo(
    () => getSearchResults(currentTree, simulatorQuery),
    [simulatorQuery],
  );
  const proposedResults = useMemo(
    () => getSearchResults(proposedTree, simulatorQuery),
    [simulatorQuery],
  );

  const changeCount =
    currentNodes.filter((item) => item.node.change !== "Identique")
      .length +
    proposedNodes.filter((item) => item.node.change !== "Identique")
      .length;

  const forceOpen =
    search.trim().length > 0 ||
    branch !== "all" ||
    onlyChanges;

  function toggleBranch(id: string) {
    setExpandedIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(id)) {
        nextIds.delete(id);
      } else {
        nextIds.add(id);
      }

      return nextIds;
    });
  }

  const shellClassName = fullScreen
    ? "fixed inset-0 z-[100] overflow-y-auto bg-background p-4 sm:p-6"
    : "space-y-6";

  return (
    <div className={shellClassName}>
      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("comparison")}
            className={
              "rounded-xl px-4 py-2.5 text-sm font-semibold " +
              (mode === "comparison"
                ? "bg-primary text-white"
                : "bg-surface-muted text-foreground hover:text-primary")
            }
          >
            Comparer les arborescences
          </button>
          <button
            type="button"
            onClick={() => setMode("simulator")}
            className={
              "rounded-xl px-4 py-2.5 text-sm font-semibold " +
              (mode === "simulator"
                ? "bg-primary text-white"
                : "bg-surface-muted text-foreground hover:text-primary")
            }
          >
            Simuler un parcours
          </button>
        </div>

        <button
          type="button"
          onClick={() => setFullScreen((current) => !current)}
          className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary"
        >
          {fullScreen ? "Quitter le plein écran" : "Afficher en plein écran"}
        </button>
      </section>

      {mode === "comparison" ? (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            <article className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-sm text-muted">Ancienne structure</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {currentNodes.length} pages
              </p>
            </article>
            <article className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-sm text-muted">Structure préconisée</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {proposedNodes.length} pages
              </p>
            </article>
            <article className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-sm text-muted">Éléments modifiés</p>
              <p className="mt-2 text-3xl font-bold text-primary">
                {changeCount}
              </p>
            </article>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-4">
              <div>
                <label
                  htmlFor="comparison-search"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Rechercher
                </label>
                <input
                  id="comparison-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Page, URL, équipe…"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>

              <div>
                <label
                  htmlFor="branch-filter"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Isoler une branche
                </label>
                <select
                  id="branch-filter"
                  value={branch}
                  onChange={(event) => setBranch(event.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                >
                  {branchOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="depth-filter"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Profondeur affichée
                </label>
                <select
                  id="depth-filter"
                  value={maximumDepth}
                  onChange={(event) =>
                    setMaximumDepth(Number(event.target.value))
                  }
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                >
                  <option value={1}>Niveau 1</option>
                  <option value={2}>Jusqu’au niveau 2</option>
                  <option value={3}>Jusqu’au niveau 3</option>
                  <option value={4}>Tous les niveaux</option>
                </select>
              </div>

              <div className="flex flex-wrap items-end gap-2">
                <button
                  type="button"
                  onClick={() => setOnlyChanges((current) => !current)}
                  className={
                    "rounded-xl border px-4 py-3 text-sm font-semibold " +
                    (onlyChanges
                      ? "border-primary bg-primary text-white"
                      : "border-border text-foreground hover:border-primary hover:text-primary")
                  }
                >
                  Différences seules
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setExpandedIds(new Set(allBranchIds))}
                className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:border-primary hover:text-primary"
              >
                Tout ouvrir
              </button>
              <button
                type="button"
                onClick={() => setExpandedIds(new Set<string>())}
                className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:border-primary hover:text-primary"
              >
                Tout fermer
              </button>

              {Object.entries(changeStyles).map(([label, style]) => (
                <span
                  key={label}
                  className={
                    "rounded-full px-2.5 py-1 text-xs font-semibold " +
                    style
                  }
                >
                  {label}
                </span>
              ))}
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-2">
            <TreePanel
              title="Arborescence actuelle"
              subtitle="Structure fictive avant réorganisation"
              tree={currentTree}
              version="Actuelle"
              visibleIds={currentVisibleIds}
              expandedIds={expandedIds}
              forceOpen={forceOpen}
              onToggle={toggleBranch}
              onSelect={setSelected}
              accentClassName="bg-accent"
            />
            <TreePanel
              title="Arborescence préconisée"
              subtitle="Structure fictive après analyse des parcours"
              tree={proposedTree}
              version="Préconisée"
              visibleIds={proposedVisibleIds}
              expandedIds={expandedIds}
              forceOpen={forceOpen}
              onToggle={toggleBranch}
              onSelect={setSelected}
              accentClassName="bg-primary"
            />
          </div>

          {selected && (
            <section className="rounded-2xl border border-primary/30 bg-surface p-6 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                    Fiche sélectionnée · {selected.version}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-foreground">
                    {selected.node.label}
                  </h2>
                  <p className="mt-2 font-mono text-sm text-primary">
                    {selected.node.path}
                  </p>
                  <p className="mt-4 max-w-3xl leading-7 text-muted">
                    {selected.node.description}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                  <span
                    className={
                      "rounded-full px-3 py-1 text-xs font-semibold " +
                      changeStyles[selected.node.change]
                    }
                  >
                    {selected.node.change}
                  </span>
                  <span className="text-sm text-muted">
                    {selected.node.owner}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="text-sm font-semibold text-primary hover:text-primary-hover"
                  >
                    Fermer la fiche
                  </button>
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <label
              htmlFor="simulator-query"
              className="block text-lg font-bold text-foreground"
            >
              Que cherchez-vous à faire ?
            </label>
            <p className="mt-1 text-sm text-muted">
              Le simulateur compare le chemin proposé dans les deux structures.
            </p>
            <input
              id="simulator-query"
              type="text"
              value={simulatorQuery}
              onChange={(event) => setSimulatorQuery(event.target.value)}
              className="mt-5 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
              placeholder="Exemple : je veux relancer un prospect"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              {simulatorExamples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setSimulatorQuery(example)}
                  className="rounded-full border border-border bg-surface-muted px-3 py-2 text-xs font-semibold text-foreground hover:border-primary hover:text-primary"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <SimulatorResults
              title="Parcours dans l’ancienne structure"
              subtitle="Résultats proposés avant réorganisation"
              results={currentResults}
              accentClassName="bg-accent"
            />
            <SimulatorResults
              title="Parcours dans la structure préconisée"
              subtitle="Résultats proposés après réorganisation"
              results={proposedResults}
              accentClassName="bg-primary"
            />
          </div>
        </section>
      )}
    </div>
  );
}
