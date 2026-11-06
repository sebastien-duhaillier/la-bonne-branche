import type { Metadata } from "next";
import SolutionDetail from "@/components/solution-detail";

export const metadata: Metadata = {
  title: "Relation client",
  description: "Une organisation simple pour mieux suivre les prospects.",
};

export default function RelationClientPage() {
  return (
    <SolutionDetail
      eyebrow="Relation client"
      title="Un suivi commercial qui ne dépend plus de la mémoire."
      introduction="Toutes les informations utiles sont regroupées afin que chaque échange débouche sur une action claire."
      benefits={[
        "Conserver les coordonnées et l’origine de chaque prospect.",
        "Visualiser son statut et la dernière activité réalisée.",
        "Programmer la prochaine relance au bon moment.",
        "Partager un historique compréhensible avec l’équipe.",
      ]}
      exampleTitle="La Bonne Relance"
      exampleDescription="Notre CRM de démonstration illustre cette approche avec la gestion des prospects, des statuts et des séquences d’e-mails."
    />
  );
}
