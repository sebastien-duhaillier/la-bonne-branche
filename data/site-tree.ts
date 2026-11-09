export type ContentStatus = "Publié" | "À vérifier" | "Brouillon";

export type SiteTreeNode = {
  id: string;
  label: string;
  path: string;
  team: string;
  status: ContentStatus;
  description: string;
  children?: SiteTreeNode[];
};

export const siteTree: SiteTreeNode = {
  id: "home",
  label: "La Bonne Branche",
  path: "/",
  team: "Direction",
  status: "Publié",
  description: "Page d’accueil et point d’entrée principal du site.",
  children: [
    {
      id: "solutions",
      label: "Solutions",
      path: "/solutions",
      team: "Conseil et projets",
      status: "Publié",
      description: "Présentation des outils et solutions proposés.",
      children: [
        {
          id: "relation-client",
          label: "Relation client",
          path: "/solutions/relation-client",
          team: "Commercial",
          status: "Publié",
          description: "Organisation des prospects et du suivi commercial.",
        },
        {
          id: "automation",
          label: "Automatisation",
          path: "/solutions/automatisation",
          team: "Conseil et projets",
          status: "Publié",
          description: "Programmation des messages et des relances.",
        },
        {
          id: "content-organisation",
          label: "Organisation des contenus",
          path: "/solutions/organisation-contenus",
          team: "Marketing et contenus",
          status: "Publié",
          description: "Structuration des rubriques et responsabilités.",
        },
      ],
    },
    {
      id: "services",
      label: "Services",
      path: "/services",
      team: "Conseil et projets",
      status: "Publié",
      description: "Méthode d’accompagnement de l’agence.",
      children: [
        {
          id: "audit",
          label: "Audit de l’organisation",
          path: "/services/audit",
          team: "Conseil et projets",
          status: "Brouillon",
          description: "Analyse des usages, outils et points de blocage.",
        },
        {
          id: "deployment",
          label: "Mise en place des outils",
          path: "/services/deploiement",
          team: "Conseil et projets",
          status: "Brouillon",
          description: "Déploiement progressif des solutions retenues.",
        },
        {
          id: "training",
          label: "Formation des équipes",
          path: "/services/formation",
          team: "Support client",
          status: "À vérifier",
          description: "Formation et documentation des utilisateurs.",
        },
      ],
    },
    {
      id: "resources",
      label: "Ressources",
      path: "/ressources",
      team: "Marketing et contenus",
      status: "Publié",
      description: "Guides, méthodes et études de cas.",
      children: [
        {
          id: "guides",
          label: "Guides pratiques",
          path: "/ressources/guides",
          team: "Marketing et contenus",
          status: "Brouillon",
          description: "Conseils directement applicables par les équipes.",
        },
        {
          id: "case-studies",
          label: "Études de cas",
          path: "/ressources/etudes-de-cas",
          team: "Marketing et contenus",
          status: "Brouillon",
          description: "Exemples fictifs d’organisations accompagnées.",
        },
      ],
    },
    {
      id: "agency",
      label: "L’agence",
      path: "/agence",
      team: "Direction",
      status: "Publié",
      description: "Présentation de l’entreprise fictive et de ses équipes.",
    },
    {
      id: "contact",
      label: "Contact",
      path: "/contact",
      team: "Commercial",
      status: "Publié",
      description: "Coordonnées fictives et informations de contact.",
    },
  ],
};

export const teams = [
  "Toutes les équipes",
  "Direction",
  "Commercial",
  "Marketing et contenus",
  "Conseil et projets",
  "Support client",
];
