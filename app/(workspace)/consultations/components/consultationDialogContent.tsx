"use client";
import { Select } from "@/app/_components/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createConsultation } from "@/lib/api/consultation";
import { ConsultationDialogProps, ConsultationType } from "@/lib/types";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ConsultationDialogContent({
  consultation,
  handleSubmit,
}: {
  consultation: ConsultationDialogProps;
  handleSubmit: () => void;
}) {
  const options: { value: ConsultationType }[] = [
  { value: ConsultationType.OrientationStrategique },
  { value: ConsultationType.BudgetRessources },
  { value: ConsultationType.PolitiqueFormation },
  { value: ConsultationType.NouvellesTechnologies },
  { value: ConsultationType.ModificationProgrammes },
  { value: ConsultationType.Partenariats },
  { value: ConsultationType.DeveloppementCompetences },
  { value: ConsultationType.ReglementAcademique },
  { value: ConsultationType.Conventions },
  { value: ConsultationType.Examens },
  { value: ConsultationType.AmenagementEspaces },
  { value: ConsultationType.QualiteVie },
];
  const [value, setValue] = useState<string>(consultation.consultationType);
  const [isLoading, setIsLoading] = useState(false);

const consultationList: ConsultationDialogProps[] = [
  {
    consultationType: ConsultationType.OrientationStrategique,
    description: `Réunion annuelle au cours de laquelle la direction académique présente la vision pédagogique du département à moyen terme. Le conseil pédagogique rend un avis consultatif pour orienter les décisions.`,
    process: [
      `Enjeux pour le personnel académique
- Anticiper les évolutions des programmes et méthodes pédagogiques.
- Comprendre les orientations stratégiques de l'université.
- Proposer des mesures d'accompagnement ou de formation.`,
      `Documents à demander à l'administration
- Plan pédagogique (présentation ou rapport).
- Projets d'innovation ou de réorganisation des cursus.
- Données sur les effectifs étudiants et besoins en ressources.`,
      `Attitude à adopter
- Lire les documents en amont et préparer des questions.
- Demander des clarifications si nécessaire.
- Formuler un avis écrit, même critique.`,
      `Bonnes pratiques
- Anticipez la réunion en demandant les documents à l'avance.
- Préparez une position commune avec vos collègues.
- Comparez les annonces aux réalités du terrain.`,
    ],
  },
  {
    consultationType: ConsultationType.BudgetRessources,
    description: `Réunion annuelle pour examiner les ressources disponibles, les résultats et les perspectives budgétaires du département. Elle permet au personnel de comprendre la situation financière et de formuler des priorités.`,
    process: [
      `Enjeux pour le personnel académique
- Identifier les ressources disponibles pour l'enseignement.
- Détecter les besoins prioritaires et les opportunités.
- Poser les bases d'une stratégie pédagogique cohérente.`,
      `Documents à demander à l'administration
- Budget départemental et allocations de ressources.
- Prévisions budgétaires pour l'année à venir.
- Présentation financière de la direction.`,
      `Attitude à adopter
- Demander une présentation accessible des chiffres.
- Comparer avec les années précédentes.
- Mettre en avant les écarts constatés et les besoins réels.`,
      `Bonnes pratiques
- Demandez les documents au moins 8 jours avant la réunion.
- Proposez des priorités pour l'allocation des ressources.
- Suggérez des alternatives si le budget est contraint.`,
    ],
  },
  {
    consultationType: ConsultationType.PolitiqueFormation,
    description: `Réunion annuelle pour faire le point sur les pratiques pédagogiques en vigueur. L'objectif est d'identifier les difficultés rencontrées et de proposer des améliorations concrètes des conditions d'enseignement.`,
    process: [
      `Enjeux pour le personnel académique
- Suivre l'évolution des effectifs, des programmes et de la qualité.
- Identifier les tensions organisationnelles.
- Proposer des actions correctives adaptées.`,
      `Documents à demander à l'administration
- Bilan pédagogique du département.
- Données sur les résultats étudiants et taux de réussite.
- Plan de développement des compétences.`,
      `Attitude à adopter
- Croiser les données chiffrées avec les retours de terrain.
- Poser des questions concrètes et ciblées.
- Mettre en avant les besoins des enseignants et des étudiants.`,
      `Bonnes pratiques
- Organisez une relecture collective avec vos collègues.
- Proposez des priorités d'action claires.
- Relancez l'administration après la réunion pour un suivi.`,
    ],
  },
  {
    consultationType: ConsultationType.NouvellesTechnologies,
    description: `Le conseil pédagogique doit être consulté avant toute mise en place de nouveaux outils numériques dans l'enseignement : plateformes, logiciels pédagogiques, intelligence artificielle, etc.`,
    process: [
      `Enjeux pour le personnel académique
- Anticiper les conséquences sur les méthodes d'enseignement.
- Évaluer l'impact réel sur la qualité pédagogique.
- S'assurer que le personnel sera formé avant le déploiement.`,
      `Documents à demander à l'administration
- Description des outils ou technologies concernés.
- Objectifs visés et planning de déploiement.
- Plan de formation prévu pour le personnel.`,
      `Attitude à adopter
- Demander une phase pilote avant tout déploiement généralisé.
- Proposer un accompagnement progressif.
- S'appuyer sur l'expérience des collègues.`,
      `Bonnes pratiques
- Vérifiez que la formation est planifiée et budgétée.
- Proposez une évaluation formelle après le déploiement.
- Impliquez les enseignants les plus concernés dès le départ.`,
    ],
  },
  {
    consultationType: ConsultationType.ModificationProgrammes,
    description: `Toute modification importante des curricula, des volumes horaires ou des méthodes d'évaluation nécessite une consultation préalable du conseil pédagogique.`,
    process: [
      `Enjeux pour le personnel académique
- Préserver la cohérence et la qualité de l'enseignement.
- Éviter les perturbations pour les étudiants en cours de cursus.
- Anticiper les impacts sur la charge de travail des enseignants.`,
      `Documents à demander à l'administration
- Projet de modification du programme concerné.
- Justification, calendrier et impact sur les cours existants.
- Mesures d'accompagnement prévues.`,
      `Attitude à adopter
- Consulter les enseignants directement concernés par les changements.
- Vérifier la cohérence avec les cursus existants.
- Proposer des ajustements si nécessaire.`,
      `Bonnes pratiques
- Intégrez les retours des étudiants dans votre analyse.
- Prévoyez une période de transition suffisante.
- Soyez attentif à l'impact sur la charge de travail globale.`,
    ],
  },
  {
    consultationType: ConsultationType.Partenariats,
    description: `Le conseil pédagogique doit être informé et consulté avant la conclusion de tout nouveau partenariat ou accord de coopération inter-universitaire, national ou international.`,
    process: [
      `Enjeux pour le personnel académique
- Identifier les opportunités et les risques pour le département.
- Obtenir des informations précises sur les modalités pratiques.
- S'assurer que les intérêts pédagogiques sont préservés.`,
      `Documents à demander à l'administration
- Note de présentation du partenariat envisagé.
- Conséquences pédagogiques et organisationnelles attendues.
- Planning prévisionnel et engagements mutuels.`,
      `Attitude à adopter
- Poser des questions précises sur l'impact réel pour le département.
- Demander des clarifications sur les échanges d'étudiants ou d'enseignants prévus.
- S'informer sur les engagements financiers et logistiques.`,
      `Bonnes pratiques
- Demandez des garanties écrites sur les modalités.
- Renseignez-vous sur l'institution partenaire.
- Impliquez les collègues directement concernés.`,
    ],
  },
  {
    consultationType: ConsultationType.DeveloppementCompetences,
    description: `Tout plan de formation ou de développement professionnel destiné au personnel académique doit faire l'objet d'une consultation du conseil pédagogique avant sa mise en oeuvre.`,
    process: [
      `Enjeux pour le personnel académique
- Améliorer les compétences pédagogiques et disciplinaires.
- Faciliter le développement professionnel de chacun.
- S'assurer que les besoins réels sont pris en compte.`,
      `Documents à demander à l'administration
- Projet de plan de formation.
- Critères de sélection des formations et mesures d'accompagnement.
- Budget alloué au développement des compétences.`,
      `Attitude à adopter
- Identifier collectivement les besoins prioritaires.
- Proposer des alternatives si l'offre est inadaptée.
- Travailler de manière concertée avec les collègues.`,
      `Bonnes pratiques
- Établissez un calendrier précis avec des jalons de suivi.
- Impliquez l'ensemble des collègues dans l'identification des besoins.
- Demandez des bilans réguliers sur la mise en oeuvre du plan.`,
    ],
  },
  {
    consultationType: ConsultationType.ReglementAcademique,
    description: `Avant toute création ou modification du règlement académique intérieur, le conseil pédagogique doit être consulté afin de garantir des règles justes, claires et adaptées au contexte universitaire.`,
    process: [
      `Enjeux pour le personnel académique
- Prévenir l'adoption de règles inadaptées ou injustes.
- Garantir des procédures transparentes et équitables.
- Protéger les droits du personnel et des étudiants.`,
      `Documents à demander à l'administration
- Projet de règlement ou de modification.
- Motifs et objectifs justifiant chaque disposition.`,
      `Attitude à adopter
- Lire chaque article avec attention.
- Comparer avec les pratiques et usages existants.
- S'opposer formellement aux clauses problématiques.`,
      `Bonnes pratiques
- Proposez des formulations alternatives si nécessaire.
- Vérifiez la cohérence avec le règlement général de l'université.`,
    ],
  },
  {
    consultationType: ConsultationType.Conventions,
    description: `Le conseil pédagogique est informé ou consulté sur les conventions et accords conclus avec d'autres institutions académiques, entreprises ou organismes partenaires.`,
    process: [
      `Enjeux pour le personnel académique
- Éviter les engagements pédagogiques défavorables.
- Protéger les intérêts du département et de ses membres.
- Comprendre les implications pratiques de chaque accord.`,
      `Documents à demander à l'administration
- Projet de convention dans son intégralité.
- Étude d'impact si disponible.
- Position et recommandations de la direction.`,
      `Attitude à adopter
- Lire la convention en détail avant toute réunion.
- Demander des précisions sur chaque engagement.
- Rédiger un avis écrit et argumenté.`,
      `Bonnes pratiques
- Comparez avec les conventions précédentes du département.
- Échangez en amont avec les collègues concernés.`,
    ],
  },
  {
    consultationType: ConsultationType.Examens,
    description: `Toute modification significative de l'organisation des examens, des modalités d'évaluation ou du calendrier académique nécessite une consultation préalable du conseil pédagogique.`,
    process: [
      `Enjeux pour le personnel académique
- Comprendre les changements proposés et leurs implications.
- Garantir l'équité de traitement pour tous les étudiants.
- Assurer la faisabilité pratique pour les enseignants.`,
      `Documents à demander à l'administration
- Nouveau calendrier des examens.
- Modalités d'évaluation proposées.
- Mesures prévues pour les situations particulières.`,
      `Attitude à adopter
- Vérifier la faisabilité des changements sur le terrain.
- Demander un dispositif de suivi régulier.
- Proposer des solutions alternatives si nécessaire.`,
      `Bonnes pratiques
- Veillez à ce que tous les étudiants soient traités équitablement.
- Contrôlez les délais et les conditions pratiques de passation.`,
    ],
  },
  {
    consultationType: ConsultationType.AmenagementEspaces,
    description: `Tout projet ayant un impact sur l'organisation ou la disponibilité des salles de cours, amphithéâtres ou espaces pédagogiques nécessite une consultation du conseil pédagogique.`,
    process: [
      `Enjeux pour le personnel académique
- Anticiper les perturbations sur l'organisation des cours.
- Négocier des améliorations des conditions d'enseignement.
- S'assurer que les espaces restent fonctionnels durant les travaux.`,
      `Documents à demander à l'administration
- Projet d'aménagement détaillé.
- Cartographie des impacts sur les espaces concernés.
- Planning prévisionnel des travaux ou changements.`,
      `Attitude à adopter
- Demander des garanties logistiques claires (équipement, accessibilité).
- Impliquer les enseignants les plus directement affectés.
- Proposer une phase de test si possible.`,
      `Bonnes pratiques
- Vérifiez les mesures prévues pendant la période de transition.
- Effectuez un suivi des conditions réelles après le changement.`,
    ],
  },
  {
    consultationType: ConsultationType.QualiteVie,
    description: `Le conseil pédagogique est systématiquement consulté sur toute mesure relative au bien-être des étudiants et du personnel, aux conditions d'études et à la qualité de l'environnement académique.`,
    process: [
      `Enjeux pour le personnel académique
- Améliorer durablement les conditions d'études et de travail.
- Identifier et signaler les situations problématiques.
- Protéger le bien-être de l'ensemble de la communauté académique.`,
      `Documents à demander à l'administration
- Enquêtes de satisfaction disponibles.
- Rapports sur les conditions d'enseignement et d'études.
- Plans d'amélioration prévus par la direction.`,
      `Attitude à adopter
- Recueillir les retours du terrain avant la réunion.
- Proposer des mesures concrètes et réalistes.
- Alerter formellement si une situation l'exige.`,
      `Bonnes pratiques
- Associez les étudiants à la remontée des retours.
- Vérifiez que les mesures annoncées sont effectivement mises en oeuvre.`,
    ],
  },
];

  const [maxHeight, setMaxHeight] = useState<string>("500px");

  useEffect(() => {
    const updateMaxHeight = () => {
      // Calculate available viewport height minus some padding for other UI elements
      const viewportHeight = window.innerHeight;
      // Adjust the offset as needed based on your layout
      const offset = 150; // Approximate space for headers, padding, etc.
      const availableHeight = viewportHeight - offset;

      // Set a minimum height to avoid very small dialogs
      const minHeight = 300;
      const maxHeight = 750;
      // Set the max height to either the available height or minimum height, whichever is larger
      if (availableHeight < minHeight) {
        setMaxHeight(`${minHeight}px`);
      } else if (availableHeight > maxHeight) {
        setMaxHeight(`${maxHeight}px`);
      } else {
        setMaxHeight(`${availableHeight}px`);
      }
    };

    // Update on mount
    updateMaxHeight();

    // Update on window resize
    window.addEventListener("resize", updateMaxHeight);
    return () => window.removeEventListener("resize", updateMaxHeight);
  }, []);

  const [localDate, setLocalDate] = useState("");
  const [showDateInput, setShowDateInput] = useState(false);

  const handleCreateConsultation = async () => {
    try {
      // Check if date is in the past when custom date is selected
      if (showDateInput && localDate) {
        const selectedDate = new Date(localDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to beginning of day for fair comparison

        if (selectedDate < today) {
          toast.error("La date ne peut pas être dans le passé");
          return;
        }
      }

      setIsLoading(true);
      toast.loading("Création de la consultation en cours...");
      let formattedDate = format(new Date(), "yyyy-MM-dd");
      if (showDateInput && localDate) {
        formattedDate = localDate;
      }

      const data = {
        type_consultation: value,
        statut: "En attente",
        description: consultationList.filter(
          (c) => c.consultationType === value
        )[0].description,
        date_requise: formattedDate,
        participants: [],
      };
      ;

      await createConsultation(data);
      toast.dismiss();
      toast.success("La consultation a été créée avec succès!");
      handleSubmit();
    } catch (error) {
console.error(error)
      ;
      toast.error("Erreur lors de la création de la consultation");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ScrollArea className="px-5" style={{ height: maxHeight, maxHeight }}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          <h6>Type de consultation</h6>

          <Select
            placeholder={"Choisissez un type de consultation"}
            options={options}
            label={"Consultations"}
            value={value}
            setValue={(e) => {
              setValue(e);
            }}
          />
        </div>
        <div className="flex pl-10 items-center bg-gradient-to-l from-[#FE6539] to-crimson-400 text-white-50 rounded-[8px] p-2 text-sm">
          <h6>Comment ça se passe ?</h6>
        </div>
        <p className="text-sm">
          {
            consultationList.find((c) => c.consultationType === value)
              ?.description
          }
        </p>

        <div className="flex flex-col gap-4">
          {consultationList
            .find((c) => c.consultationType === value)
            ?.process.map((item, index) => (
              <pre
                key={index}
                className="whitespace-pre-wrap font-sans text-sm leading-relaxed"
              >
                {item}
              </pre>
            ))}
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <Checkbox
            id="add-date"
            checked={showDateInput}
            onCheckedChange={(checked) => setShowDateInput(checked === true)}
          />
          <label
            htmlFor="add-date"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Ajouter une date
          </label>
        </div>

        {showDateInput && (
          <div className="flex flex-col gap-4 w-fit">
            <label className="font-medium text-white-800 text-xs block">
              Date
            </label>
            <Input
              type="date"
              value={localDate}
              onChange={(e) => setLocalDate(e.target.value)}
              className="w-fit"
            />
          </div>
        )}
        <Button
          className="bg-gradient-to-r from-coral-400 to-crimson-400"
          onClick={handleCreateConsultation}
          disabled={isLoading}
        >
          {isLoading ? "Création..." : "Créer"}
        </Button>
      </div>
    </ScrollArea>
  );
}
