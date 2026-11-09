export type TeamGroup = "Commerce" | "Opérations" | "Support";
export type CheckState = "yes" | "no" | "review";

export type TeamRecord = {
  id: string;
  group: TeamGroup;
  name: string;
  fullName: string;
  toolPresence: CheckState;
  directAccess: CheckState;
  workspace: string;
  contact: string;
  email: string;
  members: string[];
  usersUpToDate: boolean;
  usersCheckedAt: string;
  contentsUpToDate: boolean;
  contentsCheckedAt: string;
  notes: string;
};

export const teamGroups: TeamGroup[] = ["Commerce", "Opérations", "Support"];

export const teamSeed: TeamRecord[] = [
  {
    id: "team-acquisition",
    group: "Commerce",
    name: "Acquisition",
    fullName: "Acquisition et développement commercial",
    toolPresence: "yes",
    directAccess: "yes",
    workspace: "Espace Acquisition",
    contact: "Lina Caron",
    email: "acquisition@la-bonne-branche.example",
    members: ["Lina Caron", "Noé Richard", "Inès Rolland"],
    usersUpToDate: true,
    usersCheckedAt: "2026-11-05",
    contentsUpToDate: false,
    contentsCheckedAt: "",
    notes: "Vérifier les anciennes pages de campagne avant le prochain lancement.",
  },
  {
    id: "team-relation-client",
    group: "Commerce",
    name: "Relation client",
    fullName: "Suivi et fidélisation des clients",
    toolPresence: "yes",
    directAccess: "review",
    workspace: "Espace Relation client",
    contact: "Maya Olivier",
    email: "clients@la-bonne-branche.example",
    members: ["Maya Olivier", "Eliott Lopez"],
    usersUpToDate: true,
    usersCheckedAt: "2026-11-03",
    contentsUpToDate: true,
    contentsCheckedAt: "2026-11-04",
    notes: "",
  },
  {
    id: "team-contenus",
    group: "Opérations",
    name: "Contenus",
    fullName: "Production et organisation des contenus",
    toolPresence: "yes",
    directAccess: "yes",
    workspace: "Espace Contenus",
    contact: "Sara Fontaine",
    email: "contenus@la-bonne-branche.example",
    members: ["Sara Fontaine", "Louis Chevalier", "Ambre Roy"],
    usersUpToDate: false,
    usersCheckedAt: "",
    contentsUpToDate: true,
    contentsCheckedAt: "2026-11-06",
    notes: "Un ancien compte doit encore être contrôlé.",
  },
  {
    id: "team-projets",
    group: "Opérations",
    name: "Projets numériques",
    fullName: "Pilotage des outils et automatisations",
    toolPresence: "yes",
    directAccess: "yes",
    workspace: "Espace Projets",
    contact: "Adam Perrin",
    email: "projets@la-bonne-branche.example",
    members: ["Adam Perrin", "Lou Gauthier"],
    usersUpToDate: true,
    usersCheckedAt: "2026-11-07",
    contentsUpToDate: true,
    contentsCheckedAt: "2026-11-07",
    notes: "",
  },
  {
    id: "team-rh",
    group: "Support",
    name: "Ressources humaines",
    fullName: "Administration et recrutement",
    toolPresence: "review",
    directAccess: "no",
    workspace: "",
    contact: "Chloé Marchand",
    email: "rh@la-bonne-branche.example",
    members: ["Chloé Marchand"],
    usersUpToDate: false,
    usersCheckedAt: "",
    contentsUpToDate: false,
    contentsCheckedAt: "",
    notes: "Présence dans l’outil à confirmer avec la responsable.",
  },
  {
    id: "team-assistance",
    group: "Support",
    name: "Assistance",
    fullName: "Support interne et accompagnement",
    toolPresence: "yes",
    directAccess: "review",
    workspace: "Espace Assistance",
    contact: "Jules Renault",
    email: "assistance@la-bonne-branche.example",
    members: ["Jules Renault", "Nina Garcia"],
    usersUpToDate: false,
    usersCheckedAt: "",
    contentsUpToDate: true,
    contentsCheckedAt: "2026-11-02",
    notes: "Mettre à jour la liste après l’arrivée de la nouvelle recrue.",
  },
];

export const checkStateLabels: Record<CheckState, string> = {
  yes: "Oui",
  no: "Non",
  review: "À vérifier",
};
