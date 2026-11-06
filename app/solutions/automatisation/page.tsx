import type { Metadata } from "next";
import SolutionDetail from "@/components/solution-detail";

export const metadata: Metadata = {
  title: "Automatisation",
  description: "Automatiser les relances sans déshumaniser la relation.",
};

export default function AutomatisationPage() {
  return (
    <SolutionDetail
      eyebrow="Automatisation"
      title="Automatisez les répétitions, pas la relation."
      introduction="Les séquences prennent en charge les tâches prévisibles tandis que l’équipe conserve la maîtrise des messages et des destinataires."
      benefits={[
        "Définir plusieurs étapes et leurs délais.",
        "Personnaliser les messages avec les données du contact.",
        "Suivre les envois, les erreurs et les actions réalisées.",
        "Arrêter une séquence lorsqu’elle n’est plus pertinente.",
      ]}
      exampleTitle="Une relance en trois temps"
      exampleDescription="Un message d’information, une première relance puis un dernier rappel peuvent être programmés sans ressaisie manuelle."
    />
  );
}
