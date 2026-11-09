export type ProtectionRuleType = "page" | "branch" | "exception";

export type ProtectedUrlRule = {
  id: string;
  url: string;
  service: string;
  requester: string;
  type: ProtectionRuleType;
  reason: string;
  createdAt: string;
  revokedAt: string | null;
  isUpdated: boolean;
  updatedAt: string | null;
};

export const protectedUrlSeed: ProtectedUrlRule[] = [
  {
    id: "rule-communication-offres",
    url: "https://www.la-bonne-branche.example/solutions",
    service: "Équipe communication",
    requester: "Camille Morel",
    type: "branch",
    reason: "Conserver les pages de présentation utilisées dans les campagnes.",
    createdAt: "2026-10-14T09:20:00.000Z",
    revokedAt: null,
    isUpdated: true,
    updatedAt: "2026-11-04T14:35:00.000Z",
  },
  {
    id: "rule-rh-recrutement",
    url: "https://www.la-bonne-branche.example/agence/recrutement",
    service: "Ressources humaines",
    requester: "Nora Petit",
    type: "page",
    reason: "Page liée aux recrutements en cours.",
    createdAt: "2026-10-22T13:10:00.000Z",
    revokedAt: null,
    isUpdated: false,
    updatedAt: null,
  },
  {
    id: "rule-support-guide",
    url: "https://www.la-bonne-branche.example/ressources/guide-client",
    service: "Service client",
    requester: "Hugo Lambert",
    type: "page",
    reason: "Guide envoyé aux nouveaux clients.",
    createdAt: "2026-10-29T08:45:00.000Z",
    revokedAt: null,
    isUpdated: true,
    updatedAt: "2026-11-06T10:05:00.000Z",
  },
  {
    id: "rule-exception-ancienne-offre",
    url: "https://www.la-bonne-branche.example/solutions/ancienne-offre",
    service: "Équipe communication",
    requester: "Camille Morel",
    type: "exception",
    reason: "Page obsolète exclue de la branche protégée.",
    createdAt: "2026-11-02T15:30:00.000Z",
    revokedAt: null,
    isUpdated: false,
    updatedAt: null,
  },
];

export const ruleTypeLabels: Record<ProtectionRuleType, string> = {
  page: "Page uniquement",
  branch: "Branche et descendants",
  exception: "Exception individuelle",
};
