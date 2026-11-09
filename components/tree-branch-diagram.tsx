"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  currentTree,
  proposedTree,
  type SiteTreeNode,
} from "@/data/site-tree";

type Orientation = "horizontal" | "vertical";
type DisplayMode = "both" | "current" | "proposed";

type ViewBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type PositionedNode = {
  node: SiteTreeNode;
  x: number;
  y: number;
};

type DiagramEdge = {
  from: string;
  to: string;
};

type DiagramLayout = {
  nodes: PositionedNode[];
  edges: DiagramEdge[];
  viewBox: ViewBox;
};

const nodeWidth = 220;
const nodeHeight = 62;
const horizontalGap = 90;
const verticalGap = 28;

function collectBranchIds(node: SiteTreeNode): string[] {
  return [
    ...(node.children?.length ? [node.id] : []),
    ...(node.children?.flatMap(collectBranchIds) ?? []),
  ];
}

function findNode(
  node: SiteTreeNode,
  id: string,
): SiteTreeNode | null {
  if (node.id === id) {
    return node;
  }

  for (const child of node.children ?? []) {
    const result = findNode(child, id);

    if (result) {
      return result;
    }
  }

  return null;
}

function findPath(
  node: SiteTreeNode,
  id: string,
  path: SiteTreeNode[] = [],
): SiteTreeNode[] | null {
  const nextPath = [...path, node];

  if (node.id === id) {
    return nextPath;
  }

  for (const child of node.children ?? []) {
    const result = findPath(child, id, nextPath);

    if (result) {
      return result;
    }
  }

  return null;
}

function wrapLabel(label: string): string[] {
  const words = label.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = (currentLine + " " + word).trim();

    if (candidate.length > 25 && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = candidate;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.slice(0, 2);
}

function createLayout(
  root: SiteTreeNode,
  expandedIds: Set<string>,
  orientation: Orientation,
): DiagramLayout {
  const nodes: PositionedNode[] = [];
  const edges: DiagramEdge[] = [];
  let leafIndex = 0;

  function placeNode(
    node: SiteTreeNode,
    depth: number,
  ): PositionedNode {
    const children = expandedIds.has(node.id)
      ? node.children ?? []
      : [];

    const positionedChildren = children.map((child) =>
      placeNode(child, depth + 1),
    );

    const y =
      positionedChildren.length > 0
        ? (positionedChildren[0].y +
            positionedChildren[positionedChildren.length - 1].y) /
          2
        : leafIndex++ * (nodeHeight + verticalGap) + 40;

    const positionedNode = {
      node,
      x: depth * (nodeWidth + horizontalGap) + 40,
      y,
    };

    nodes.push(positionedNode);

    for (const child of positionedChildren) {
      edges.push({
        from: node.id,
        to: child.node.id,
      });
    }

    return positionedNode;
  }

  placeNode(root, 0);

  const orientedNodes =
    orientation === "horizontal"
      ? nodes
      : nodes.map((item) => ({
          ...item,
          x: item.y,
          y: item.x,
        }));

  const maximumX = Math.max(
    ...orientedNodes.map((item) => item.x + nodeWidth),
  );
  const maximumY = Math.max(
    ...orientedNodes.map((item) => item.y + nodeHeight),
  );

  return {
    nodes: orientedNodes,
    edges,
    viewBox: {
      x: 0,
      y: 0,
      width: Math.max(760, maximumX + 60),
      height: Math.max(480, maximumY + 60),
    },
  };
}

function countByLevel(root: SiteTreeNode): number[] {
  const counts = [0, 0, 0, 0];

  function visit(node: SiteTreeNode, depth: number) {
    const level = Math.min(depth, counts.length - 1);
    counts[level] += 1;

    for (const child of node.children ?? []) {
      visit(child, depth + 1);
    }
  }

  visit(root, 0);
  return counts;
}

type DiagramPanelProps = {
  title: string;
  subtitle: string;
  tree: SiteTreeNode;
  variant: "current" | "proposed";
};

function DiagramPanel({
  title,
  subtitle,
  tree,
  variant,
}: DiagramPanelProps) {
  const allBranchIds = useMemo(
    () => collectBranchIds(tree),
    [tree],
  );

  const [expandedIds, setExpandedIds] = useState(
    () => new Set([tree.id]),
  );
  const [orientation, setOrientation] =
    useState<Orientation>("horizontal");
  const [isolatedId, setIsolatedId] = useState<string | null>(
    null,
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    null,
  );
  const [panelFullscreen, setPanelFullscreen] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    initialViewBox: ViewBox;
  } | null>(null);

  const displayedRoot = useMemo(
    () =>
      isolatedId ? findNode(tree, isolatedId) ?? tree : tree,
    [tree, isolatedId],
  );

  const layout = useMemo(
    () => createLayout(displayedRoot, expandedIds, orientation),
    [displayedRoot, expandedIds, orientation],
  );

  const [viewBox, setViewBox] = useState<ViewBox>(
    layout.viewBox,
  );

  const nodePositions = useMemo(
    () =>
      new Map(
        layout.nodes.map((item) => [item.node.id, item]),
      ),
    [layout.nodes],
  );

  const breadcrumb = useMemo(
    () =>
      isolatedId
        ? findPath(tree, isolatedId) ?? [tree]
        : [tree],
    [tree, isolatedId],
  );

  useEffect(() => {
    setViewBox(layout.viewBox);
  }, [layout]);

  useEffect(() => {
    if (!panelFullscreen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeWithEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPanelFullscreen(false);
      }
    }

    window.addEventListener("keydown", closeWithEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [panelFullscreen]);

  function toggleNode(node: SiteTreeNode) {
    setSelectedId(node.id);

    if (!node.children?.length) {
      return;
    }

    setExpandedIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(node.id)) {
        nextIds.delete(node.id);
      } else {
        nextIds.add(node.id);
      }

      return nextIds;
    });
  }

  function zoom(factor: number) {
    setViewBox((current) => {
      const nextWidth = Math.max(
        320,
        Math.min(12000, current.width * factor),
      );
      const nextHeight =
        nextWidth * (current.height / current.width);

      return {
        x: current.x + (current.width - nextWidth) / 2,
        y: current.y + (current.height - nextHeight) / 2,
        width: nextWidth,
        height: nextHeight,
      };
    });
  }

  function startDrag(
    clientX: number,
    clientY: number,
    target: EventTarget | null,
  ): boolean {
    if (
      target instanceof Element &&
      target.closest("[data-tree-node]")
    ) {
      return false;
    }

    dragRef.current = {
      startX: clientX,
      startY: clientY,
      initialViewBox: viewBox,
    };

    return true;
  }

  function moveDrag(clientX: number, clientY: number) {
    const drag = dragRef.current;
    const svg = svgRef.current;

    if (!drag || !svg) {
      return;
    }

    const rectangle = svg.getBoundingClientRect();

    setViewBox({
      ...drag.initialViewBox,
      x:
        drag.initialViewBox.x -
        ((clientX - drag.startX) * drag.initialViewBox.width) /
          Math.max(1, rectangle.width),
      y:
        drag.initialViewBox.y -
        ((clientY - drag.startY) * drag.initialViewBox.height) /
          Math.max(1, rectangle.height),
    });
  }

  function resetTree() {
    setExpandedIds(new Set([displayedRoot.id]));
    setSelectedId(null);
  }

  function expandTree() {
    setExpandedIds(new Set(allBranchIds));
  }

  function isolateSelectedNode() {
    if (!selectedId || selectedId === tree.id) {
      return;
    }

    setIsolatedId(selectedId);
    setExpandedIds(new Set(allBranchIds));
    setSelectedId(null);
  }

  const selectedNode = selectedId
    ? findNode(tree, selectedId)
    : null;

  const panelClassName = panelFullscreen
    ? "fixed inset-2 z-[120] flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
    : "flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm";

  return (
    <section className={panelClassName}>
      <header
        className={
          "border-b border-border p-5 " +
          (variant === "current"
            ? "bg-accent-soft/60"
            : "bg-success/10")
        }
      >
        <h3 className="text-xl font-bold text-foreground">
          {title}
        </h3>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </header>

      <div className="flex flex-wrap gap-2 border-b border-border p-3">
        <button
          type="button"
          onClick={() => setViewBox(layout.viewBox)}
          className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:border-primary hover:text-primary"
        >
          Vue d’ensemble
        </button>
        <button
          type="button"
          onClick={() => zoom(0.8)}
          className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:border-primary hover:text-primary"
        >
          Zoom +
        </button>
        <button
          type="button"
          onClick={() => zoom(1.25)}
          className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:border-primary hover:text-primary"
        >
          Zoom −
        </button>
        <button
          type="button"
          onClick={resetTree}
          className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:border-primary hover:text-primary"
        >
          Replier
        </button>
        <button
          type="button"
          onClick={expandTree}
          className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:border-primary hover:text-primary"
        >
          Déplier
        </button>
        <button
          type="button"
          onClick={() =>
            setOrientation((current) =>
              current === "horizontal"
                ? "vertical"
                : "horizontal",
            )
          }
          className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:border-primary hover:text-primary"
        >
          {orientation === "horizontal"
            ? "Orientation verticale"
            : "Orientation horizontale"}
        </button>
        <button
          type="button"
          onClick={isolateSelectedNode}
          disabled={
            !selectedNode ||
            selectedNode.id === tree.id ||
            !selectedNode.children?.length
          }
          className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          Isoler la branche
        </button>
        <button
          type="button"
          onClick={() =>
            setPanelFullscreen((current) => !current)
          }
          className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:border-primary hover:text-primary"
        >
          {panelFullscreen
            ? "Quitter le plein écran"
            : "Plein écran"}
        </button>
      </div>

      <nav
        aria-label="Fil d’Ariane de la branche isolée"
        className="flex min-h-10 items-center gap-1 overflow-x-auto border-b border-border bg-surface-muted/60 px-4 py-2"
      >
        {breadcrumb.map((item, index) => (
          <span
            key={item.id}
            className="flex shrink-0 items-center gap-1"
          >
            {index > 0 && (
              <span className="text-muted">›</span>
            )}
            <button
              type="button"
              onClick={() => {
                setIsolatedId(
                  item.id === tree.id ? null : item.id,
                );
                setSelectedId(null);
              }}
              className="text-xs font-semibold text-primary hover:text-primary-hover"
            >
              {item.label}
            </button>
          </span>
        ))}
      </nav>

      <div
        className={
          "relative min-h-[520px] flex-1 overflow-hidden bg-[radial-gradient(circle,_var(--border)_1px,_transparent_1px)] bg-[length:20px_20px] " +
          (panelFullscreen ? "h-full" : "h-[620px]")
        }
      >
        <svg
          ref={svgRef}
          viewBox={[
            viewBox.x,
            viewBox.y,
            viewBox.width,
            viewBox.height,
          ].join(" ")}
          className="size-full cursor-grab touch-none active:cursor-grabbing"
          role="img"
          aria-label={title}
          onPointerDown={(event) => {
            const dragStarted = startDrag(
              event.clientX,
              event.clientY,
              event.target,
            );

            if (dragStarted) {
              event.currentTarget.setPointerCapture(
                event.pointerId,
              );
            }
          }}
          onPointerMove={(event) =>
            moveDrag(event.clientX, event.clientY)
          }
          onPointerUp={() => {
            dragRef.current = null;
          }}
          onPointerCancel={() => {
            dragRef.current = null;
          }}
          onWheel={(event) => {
            event.preventDefault();
            zoom(event.deltaY > 0 ? 1.12 : 0.88);
          }}
        >
          <g>
            {layout.edges.map((edge) => {
              const from = nodePositions.get(edge.from);
              const to = nodePositions.get(edge.to);

              if (!from || !to) {
                return null;
              }

              const horizontal =
                orientation === "horizontal";

              const path = horizontal
                ? [
                    "M",
                    from.x + nodeWidth,
                    from.y + nodeHeight / 2,
                    "H",
                    from.x + nodeWidth + horizontalGap / 2,
                    "V",
                    to.y + nodeHeight / 2,
                    "H",
                    to.x,
                  ].join(" ")
                : [
                    "M",
                    from.x + nodeWidth / 2,
                    from.y + nodeHeight,
                    "V",
                    from.y + nodeHeight + horizontalGap / 2,
                    "H",
                    to.x + nodeWidth / 2,
                    "V",
                    to.y,
                  ].join(" ");

              return (
                <path
                  key={edge.from + "-" + edge.to}
                  d={path}
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </g>

          <g>
            {layout.nodes.map(({ node, x, y }) => {
              const lines = wrapLabel(node.label);
              const isRoot = node.id === displayedRoot.id;
              const isSelected = node.id === selectedId;
              const fill = isRoot
                ? variant === "current"
                  ? "var(--accent)"
                  : "var(--success)"
                : isSelected
                  ? "var(--accent-soft)"
                  : "var(--surface)";
              const stroke = isSelected
                ? "var(--primary)"
                : isRoot
                  ? fill
                  : "var(--border)";

              return (
                <g
                  key={node.id}
                  data-tree-node
                  transform={
                    "translate(" + x + " " + y + ")"
                  }
                  role="button"
                  tabIndex={0}
                  aria-label={
                    node.label +
                    (node.children?.length
                      ? ", cliquer pour ouvrir ou fermer"
                      : "")
                  }
                  onClick={() => toggleNode(node)}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      event.preventDefault();
                      toggleNode(node);
                    }
                  }}
                  className="cursor-pointer outline-none"
                >
                  <rect
                    width={nodeWidth}
                    height={nodeHeight}
                    rx="12"
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isSelected ? 4 : 2}
                    vectorEffect="non-scaling-stroke"
                  />

                  <text
                    x="13"
                    y={lines.length === 1 ? 29 : 20}
                    fill={
                      isRoot
                        ? "white"
                        : "var(--foreground)"
                    }
                    fontSize="13"
                    fontWeight="700"
                    pointerEvents="none"
                  >
                    {lines.map((line, index) => (
                      <tspan
                        key={line}
                        x="13"
                        dy={index === 0 ? 0 : 16}
                      >
                        {line}
                      </tspan>
                    ))}
                  </text>

                  {node.children?.length ? (
                    <text
                      x={nodeWidth - 12}
                      y={nodeHeight - 10}
                      textAnchor="end"
                      fill={
                        isRoot ? "white" : "var(--muted)"
                      }
                      fontSize="10"
                      pointerEvents="none"
                    >
                      {expandedIds.has(node.id) ? "−" : "+"}
                      {" "}
                      {node.children.length}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </g>
        </svg>

        <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-surface/90 px-3 py-2 text-xs text-muted shadow-sm">
          Molette : zoom · glisser le fond : déplacer
        </div>
      </div>

      <footer className="border-t border-border px-4 py-3 text-xs text-muted">
        {layout.nodes.length} éléments affichés
        {selectedNode
          ? " · sélection : " + selectedNode.label
          : ""}
      </footer>
    </section>
  );
}

export default function BranchComparison() {
  const [displayMode, setDisplayMode] =
    useState<DisplayMode>("both");

  const currentLevels = useMemo(
    () => countByLevel(currentTree),
    [],
  );
  const proposedLevels = useMemo(
    () => countByLevel(proposedTree),
    [],
  );
  const maximumLevelCount = Math.max(
    1,
    ...currentLevels,
    ...proposedLevels,
  );

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setDisplayMode("both")}
            className={
              "rounded-xl px-4 py-2.5 text-sm font-semibold " +
              (displayMode === "both"
                ? "bg-primary text-white"
                : "bg-surface-muted text-foreground")
            }
          >
            Côte à côte
          </button>
          <button
            type="button"
            onClick={() => setDisplayMode("current")}
            className={
              "rounded-xl px-4 py-2.5 text-sm font-semibold " +
              (displayMode === "current"
                ? "bg-primary text-white"
                : "bg-surface-muted text-foreground")
            }
          >
            Actuelle seule
          </button>
          <button
            type="button"
            onClick={() => setDisplayMode("proposed")}
            className={
              "rounded-xl px-4 py-2.5 text-sm font-semibold " +
              (displayMode === "proposed"
                ? "bg-primary text-white"
                : "bg-surface-muted text-foreground")
            }
          >
            Préconisée seule
          </button>
        </div>

        <p className="text-sm text-muted">
          Cliquez sur un bloc pour ouvrir ses descendants.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <h3 className="font-bold text-foreground">
          Différences par niveau
        </h3>
        <p className="mt-1 text-sm text-muted">
          Nombre de rubriques dans chaque profondeur.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {currentLevels.map((currentCount, index) => {
            const proposedCount = proposedLevels[index];

            return (
              <article
                key={index}
                className="rounded-xl border border-border p-4"
              >
                <p className="text-sm font-semibold text-foreground">
                  Niveau {index + 1}
                </p>

                <div className="mt-4 space-y-3">
                  <div>
                    <div className="mb-1 flex justify-between text-xs text-muted">
                      <span>Actuelle</span>
                      <span>{currentCount}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{
                          width:
                            (currentCount /
                              maximumLevelCount) *
                              100 +
                            "%",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-xs text-muted">
                      <span>Préconisée</span>
                      <span>{proposedCount}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                      <div
                        className="h-full rounded-full bg-success"
                        style={{
                          width:
                            (proposedCount /
                              maximumLevelCount) *
                              100 +
                            "%",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div
        className={
          displayMode === "both"
            ? "grid gap-6 xl:grid-cols-2"
            : "grid grid-cols-1 gap-6"
        }
      >
        {displayMode !== "proposed" && (
          <DiagramPanel
            title="Arborescence actuelle"
            subtitle="Structure fictive avant réorganisation"
            tree={currentTree}
            variant="current"
          />
        )}

        {displayMode !== "current" && (
          <DiagramPanel
            title="Arborescence préconisée"
            subtitle="Structure fictive après simplification"
            tree={proposedTree}
            variant="proposed"
          />
        )}
      </div>
    </div>
  );
}
