export type MigrationStatus =
  | "À contacter"
  | "Message préparé"
  | "Réponse reçue"
  | "À préciser"
  | "En attente de validation"
  | "Droits validés"
  | "Compte créé"
  | "Accès vérifiés";

export type PermissionScope = {
  id: string;
  url: string;
  reach: "Page précise" | "Rubrique" | "Branche et descendants" | "Site complet";
  actions: string;
  notes: string;
};

export type UserMigration = {
  id: string;
  firstName: string;
  lastName: string;
  team: string;
  email: string;
  manager: string;
  status: MigrationStatus;
  notes: string;
  scopes: PermissionScope[];
  updatedAt: string;
};

export const migrationStatuses: MigrationStatus[] = [
  "À contacter",
  "Message préparé",
  "Réponse reçue",
  "À préciser",
  "En attente de validation",
  "Droits validés",
  "Compte créé",
  "Accès vérifiés",
];

export const migrationSeed: UserMigration[] = [
  {
    id: "migration-lina-caron",
    firstName: "Lina",
    lastName: "Caron",
    team: "Acquisition",
    email: "lina.caron@la-bonne-branche.example",
    manager: "Émilie Durand",
    status: "Accès vérifiés",
    notes: "Accès contrôlés avec la responsable du pôle Commerce.",
    scopes: [
      {
        id: "scope-lina-solutions",
        url: "https://www.la-bonne-branche.example/solutions",
        reach: "Branche et descendants",
        actions: "Créer, modifier et publier",
        notes: "Hors pages d’archives.",
      },
    ],
    updatedAt: "2026-11-07T15:20:00.000Z",
  },
  {
    id: "migration-noe-richard",
    firstName: "Noé",
    lastName: "Richard",
    team: "Acquisition",
    email: "noe.richard@la-bonne-branche.example",
    manager: "Émilie Durand",
    status: "Droits validés",
    notes: "",
    scopes: [
      {
        id: "scope-noe-campagnes",
        url: "https://www.la-bonne-branche.example/ressources/campagnes",
        reach: "Rubrique",
        actions: "Créer et modifier",
        notes: "Publication soumise à validation.",
      },
    ],
    updatedAt: "2026-11-06T09:10:00.000Z",
  },
  {
    id: "migration-ambre-roy",
    firstName: "Ambre",
    lastName: "Roy",
    team: "Contenus",
    email: "ambre.roy@la-bonne-branche.example",
    manager: "Sara Fontaine",
    status: "En attente de validation",
    notes: "Le périmètre des ressources reste à confirmer.",
    scopes: [
      {
        id: "scope-ambre-guides",
        url: "https://www.la-bonne-branche.example/ressources/guides",
        reach: "Branche et descendants",
        actions: "Créer, modifier et archiver",
        notes: "",
      },
      {
        id: "scope-ambre-agence",
        url: "https://www.la-bonne-branche.example/agence",
        reach: "Page précise",
        actions: "Modifier",
        notes: "Sans droit de publication.",
      },
    ],
    updatedAt: "2026-11-05T11:45:00.000Z",
  },
  {
    id: "migration-nina-garcia",
    firstName: "Nina",
    lastName: "Garcia",
    team: "Assistance",
    email: "nina.garcia@la-bonne-branche.example",
    manager: "Jules Renault",
    status: "À contacter",
    notes: "Nouvelle arrivée : besoins à recenser.",
    scopes: [],
    updatedAt: "2026-11-02T08:30:00.000Z",
  },
];

export const statusIndex = (status: MigrationStatus) =>
  migrationStatuses.indexOf(status);
