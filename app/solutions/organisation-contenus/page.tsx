import type { Metadata } from "next";
import SolutionDetail from "@/components/solution-detail";

export const metadata: Metadata = {
  title: "Organisation des contenus",
  description: "Structurer les contenus et clarifier leur responsabilité.",
};

export default function OrganisationContenusPage() {
  return (
    <SolutionDetail
      eyebrow="Organisation des contenus"
      title="Une arborescence compréhensible avant même de publier."
      introduction="La structure du site est pensée à partir des besoins des visiteurs et des responsabilités internes, pas à partir d’une accumulation de pages."
      benefits={[
        "Visualiser les rubriques et leurs niveaux.",
        "Repérer les doublons et les contenus mal placés.",
        "Associer chaque rubrique à une équipe responsable.",
        "Préparer une nouvelle structure avant sa mise en ligne.",
      ]}
      exampleTitle="Le futur outil d’arborescence"
      exampleDescription="La prochaine partie du projet permettra de manipuler la structure de ce site fictif et de comparer plusieurs organisations."
    />
  );
}
