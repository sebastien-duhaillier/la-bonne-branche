"use client";

import { useMemo, useState } from "react";
import {
  siteTree,
  teams,
  type ContentStatus,
  type SiteTreeNode,
} from "@/data/site-tree";

const statusStyles: Record<ContentStatus, string> = {
  Publié: "bg-success/10 text-success",
  "À vérifier": "bg-warning/10 text-warning",
  Brouillon: "bg-secondary/15 text-secondary",
};

function flattenTree(node: SiteTreeNode): SiteTreeNode[] {
  return [node, ...(node.children?.flatMap(flattenTree) ?? [])];
}

function getVisibleIds(
  node: SiteTreeNode,
  search: string,
  team: string,
  result: Set<string>,
): boolean {
  const normalizedSearch = search.trim().toLocaleLowerCase("fr");
  const matchesSearch =
    normalizedSearch.length === 0 ||
    node.label.toLocaleLowerCase("fr").includes(normalizedSearch) ||
    node.path.toLocaleLowerCase("fr").includes(normalizedSearch) ||
    node.description.toLocaleLowerCase("fr").includes(normalizedSearch);

  const matchesTeam = team === teams[0] || node.team === team;
  let childMatches = false;

  for (const child of node.children ?? []) {
    if (getVisibleIds(child, search, team, result)) {
      childMatches = true;
    }
  }

  if ((matchesSearch && matchesTeam) || childMatches) {
    result.add(node.id);
    return true;
  }

  return false;
}

type TreeBranchProps = {
  node: SiteTreeNode;
  depth: number;
  expandedIds: Set<string>;
  visibleIds: Set<string>;
  forceOpen: boolean;
  selectedId: string;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
};

function TreeBranch({
  node,
  depth,
  expandedIds,
  visibleIds,
  forceOpen,
  selectedId,
  onToggle,
  onSelect,
}: TreeBranchProps) {
  if (!visibleIds.has(node.id)) {
    return null;
  }

  const hasChildren = Boolean(node.children?.length);
  const isOpen = forceOpen || expandedIds.has(node.id);
  const isSelected = selectedId === node.id;

  const rowClassName = [
    "group flex items-center gap-2 rounded-xl border px-3 py-2.5 transition",
    isSelected
      ? "border-primary bg-accent-soft"
      : "border-transparent hover:border-border hover:bg-surface-muted",
  ].join(" ");

  const toggleClassName = [
    "flex size-7 shrink-0 items-center justify-center rounded-lg text-sm",
    hasChildren
      ? "cursor-pointer bg-surface text-primary hover:bg-border"
      : "cursor-default text-muted",
  ].join(" ");

  return (
    <div>
      <div
        className={rowClassName}
        style={{ marginLeft: depth * 20 }}
      >
        <button
          type="button"
          onClick={() => hasChildren && onToggle(node.id)}
          aria-label={
            hasChildren
              ? (isOpen ? "Fermer " : "Ouvrir ") + node.label
              : undefined
          }
          className={toggleClassName}
        >
          {hasChildren ? (isOpen ? "−" : "+") : "•"}
        </button>

        <button
          type="button"
          onClick={() => onSelect(node.id)}
          className="min-w-0 flex-1 text-left"
        >
          <span className="block truncate font-semibold text-foreground">
            {node.label}
          </span>
          <span className="block truncate text-xs text-muted">
            {node.path}
          </span>
        </button>

        <span
          className={
            "hidden rounded-full px-2.5 py-1 text-xs font-semibold sm:inline-flex " +
            statusStyles[node.status]
          }
        >
          {node.status}
        </span>
      </div>

      {hasChildren && isOpen && (
        <div>
          {node.children?.map((child) => (
            <TreeBranch
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              visibleIds={visibleIds}
              forceOpen={forceOpen}
              selectedId={selectedId}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SiteTreeViewer() {
  const allNodes = useMemo(() => flattenTree(siteTree), []);
  const branchIds = useMemo(
    () =>
      allNodes
        .filter((node) => node.children?.length)
        .map((node) => node.id),
    [allNodes],
  );

  const [search, setSearch] = useState("");
  const [team, setTeam] = useState(teams[0]);
  const [selectedId, setSelectedId] = useState(siteTree.id);
  const [expandedIds, setExpandedIds] = useState(
    () => new Set(branchIds),
  );

  const visibleIds = useMemo(() => {
    const result = new Set<string>();
    getVisibleIds(siteTree, search, team, result);
    return result;
  }, [search, team]);

  const selectedNode =
    allNodes.find((node) => node.id === selectedId) ?? siteTree;

  const forceOpen = search.trim().length > 0 || team !== teams[0];
  const visibleCount = allNodes.filter((node) =>
    visibleIds.has(node.id),
  ).length;

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

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-sm text-muted">Pages représentées</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {allNodes.length}
          </p>
        </article>

        <article className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-sm text-muted">Résultats visibles</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {visibleCount}
          </p>
        </article>

        <article className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-sm text-muted">Niveaux maximum</p>
          <p className="mt-2 text-3xl font-bold text-foreground">3</p>
        </article>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_260px_auto]">
          <div>
            <label
              htmlFor="tree-search"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Rechercher une page
            </label>
            <input
              id="tree-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nom, chemin ou description"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div>
            <label
              htmlFor="team-filter"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Équipe responsable
            </label>
            <select
              id="team-filter"
              value={team}
              onChange={(event) => setTeam(event.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              {teams.map((currentTeam) => (
                <option key={currentTeam} value={currentTeam}>
                  {currentTeam}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => setExpandedIds(new Set(branchIds))}
              className="rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary"
            >
              Tout ouvrir
            </button>
            <button
              type="button"
              onClick={() => setExpandedIds(new Set<string>())}
              className="rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary"
            >
              Tout fermer
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-foreground">
              Arborescence du site
            </h2>
            <p className="mt-1 text-sm text-muted">
              Sélectionnez une page pour afficher ses informations.
            </p>
          </div>

          {visibleCount > 0 ? (
            <div className="space-y-1">
              <TreeBranch
                node={siteTree}
                depth={0}
                expandedIds={expandedIds}
                visibleIds={visibleIds}
                forceOpen={forceOpen}
                selectedId={selectedId}
                onToggle={toggleBranch}
                onSelect={setSelectedId}
              />
            </div>
          ) : (
            <div className="rounded-2xl bg-surface-muted px-5 py-12 text-center">
              <p className="font-semibold text-foreground">
                Aucun contenu trouvé
              </p>
              <p className="mt-1 text-sm text-muted">
                Modifiez la recherche ou le filtre sélectionné.
              </p>
            </div>
          )}
        </section>

        <aside className="h-fit rounded-2xl border border-border bg-surface p-6 shadow-sm xl:sticky xl:top-28">
          <span
            className={
              "inline-flex rounded-full px-3 py-1 text-xs font-semibold " +
              statusStyles[selectedNode.status]
            }
          >
            {selectedNode.status}
          </span>

          <h2 className="mt-4 text-2xl font-bold text-foreground">
            {selectedNode.label}
          </h2>
          <p className="mt-2 font-mono text-sm text-primary">
            {selectedNode.path}
          </p>

          <dl className="mt-6 space-y-5">
            <div>
              <dt className="text-sm font-medium text-muted">
                Équipe responsable
              </dt>
              <dd className="mt-1 font-semibold text-foreground">
                {selectedNode.team}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted">Description</dt>
              <dd className="mt-1 leading-7 text-foreground">
                {selectedNode.description}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted">
                Sous-rubriques directes
              </dt>
              <dd className="mt-1 font-semibold text-foreground">
                {selectedNode.children?.length ?? 0}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
