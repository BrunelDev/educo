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
    { value: ConsultationType.Accord },
    { value: ConsultationType.Fusion },
    { value: ConsultationType.Introduction },
    { value: ConsultationType.Modification },
    { value: ConsultationType.Orientation },
    { value: ConsultationType.Politique },
    { value: ConsultationType.Situation },
    { value: ConsultationType.ReglementInterieur },
    { value: ConsultationType.ActivitePartielle },
    { value: ConsultationType.DemenagementReorganisationSite },
    { value: ConsultationType.RisquesProfessionnels },
    { value: ConsultationType.AccordsCollectif },
  ];
  const [value, setValue] = useState<string>(consultation.consultationType);
  const [isLoading, setIsLoading] = useState(false);

  const consultationList: ConsultationDialogProps[] = [
    {
      consultationType: ConsultationType.Orientation,
      description: `
Cette réunion a lieu une fois par an. La direction académique présente la vision pédagogique du département à moyen terme (généralement sur 3 ans). Le conseil pédagogique rend un avis consultatif pour orienter les décisions.
`,
      process: [
        `📌 Enjeux pour le personnel académique
- Anticiper les évolutions des programmes, des méthodes pédagogiques.
- Comprendre les orientations stratégiques de l'université.
- Proposer des mesures d'accompagnement ou de formation.`,
        `📄 Documents à demander à l'administration
- Plan pédagogique (présentation ou rapport).
- Projets d'innovation, de réorganisation des cursus.
- Données sur les effectifs étudiants, besoins en ressources.`,
        `
🧠 Attitude à adopter
- Lire les documents en amont, préparer des questions.
- Demander des clarifications si nécessaire.
- Donner un avis écrit, même critique.`,
        `🧩 Bonnes pratiques
✔ Anticipez la réunion en demandant les documents.
✔ Préparez une position commune avec vos collègues.
✔ Comparez les annonces aux réalités du terrain.`,
      ],
    },
    {
      consultationType: ConsultationType.Situation,
      description: `📊 Réunion sur le budget et les ressources académiques

Réunion annuelle pour examiner les ressources, résultats et perspectives budgétaires. Elle permet au personnel académique de comprendre la situation financière du département.`,
      process: [
        `📌 Enjeux pour le personnel académique
- Identifier les ressources disponibles pour l'enseignement.
- Détecter les besoins prioritaires ou les opportunités.
- Poser les bases d'une stratégie pédagogique efficace.`,
        `📄 Documents à demander à l'administration
- Budget départemental, allocations de ressources.
- Prévisions budgétaires.
- Présentation financière de la direction.`,
        `🧠 Attitude à adopter
- Demander une présentation pédagogique des chiffres.
- Comparer avec les années précédentes.
- Mettre en avant les écarts et les besoins.`,
        `🧩 Bonnes pratiques
✔ Demander les documents 8 jours avant.
✔ Proposer des priorités pour l'allocation des ressources.
✔ Suggérer des alternatives si nécessaire.`,
      ],
    },
    {
      consultationType: ConsultationType.Politique,
      description: `👥 Réunion sur la politique de formation et les conditions d'enseignement

Réunion annuelle pour faire le point sur les pratiques pédagogiques. L'objectif est de détecter les difficultés et améliorer les conditions d'enseignement.`,
      process: [
        `📌 Enjeux pour le personnel académique
- Suivre l'évolution des effectifs, des programmes, de la qualité.
- Identifier les tensions organisationnelles.
- Proposer des actions correctives.`,
        `📄 Documents à demander à l'administration
- Bilan pédagogique du département.
- Données sur les résultats étudiants, taux de réussite.
- Plan de développement des compétences.`,
        `🧠 Attitude à adopter
- Croiser les chiffres avec les retours terrain.
- Poser des questions concrètes.
- Mettre en avant les besoins des enseignants et étudiants.`,
        `🧩 Bonnes pratiques
✔ Organiser une relecture à plusieurs collègues.
✔ Proposer des priorités d'action.
✔ Ne pas hésiter à relancer l'administration après la réunion.`,
      ],
    },
    {
      consultationType: ConsultationType.Introduction,
      description: `🖥 Intégration de nouvelles technologies pédagogiques

Le conseil pédagogique doit être consulté avant toute mise en place de nouveaux outils numériques (plateformes, logiciels pédagogiques, IA, etc.).`,
      process: [
        `📌 Enjeux pour le personnel académique
- Anticiper les conséquences sur les méthodes d'enseignement.
- Évaluer les impacts sur la qualité pédagogique.`,
        `📄 Documents à demander à l'administration
- Description des outils ou technologies.
- Objectifs visés, planning de déploiement.
- Plan de formation prévu.`,
        `🧠 Attitude à adopter
- Demander une phase pilote ou un test.
- Proposer des accompagnements.
- S'appuyer sur l'expertise des collègues.`,
        `🧩 Bonnes pratiques
✔ Rappeler que la consultation est importante.
✔ Vérifier que la formation est prévue.
✔ Proposer une évaluation post-déploiement.`,
      ],
    },
    {
      consultationType: ConsultationType.Modification,
      description: `🔄 Modification des programmes d'enseignement

Toute modification importante des curricula ou des méthodes pédagogiques nécessite une consultation du conseil pédagogique.`,
      process: [
        `📌 Enjeux pour le personnel académique
- Préserver la qualité de l'enseignement.
- Éviter les perturbations pour les étudiants.`,
        `📄 Documents à demander à l'administration
- Projet de changement de programme.
- Justification, calendrier, impact sur les cours.
- Mesures d'accompagnement.`,
        `🧠 Attitude à adopter
- Interroger les enseignants des matières impactées.
- Vérifier la cohérence avec les cursus existants.
- Proposer des ajustements.`,
        `🧩 Bonnes pratiques
✔ Consulter les retours des étudiants.
✔ Prévoir une période de transition.
✔ Être vigilant sur la charge de travail.`,
      ],
    },
    {
      consultationType: ConsultationType.Fusion,
      description: `🔗 Partenariats et coopérations universitaires

Le conseil pédagogique doit être informé et consulté avant tout nouveau partenariat ou coopération inter-universitaire.`,
      process: [
        `📌 Enjeux pour le personnel académique
- Identifier les opportunités et risques pour le département.
- Obtenir des informations sur les modalités.`,
        `📄 Documents à demander à l'administration
- Note de présentation du partenariat.
- Conséquences pédagogiques et organisationnelles.
- Planning prévisionnel.`,
        `🧠 Attitude à adopter
- Poser des questions sur l'impact réel.
- Demander des précisions sur les échanges prévus.
- S'informer sur les engagements mutuels.`,
        `🧩 Bonnes pratiques
✔ Demander des garanties écrites.
✔ S'informer sur l'université partenaire.
✔ Impliquer les collègues concernés.`,
      ],
    },
    {
      consultationType: ConsultationType.Accord,
      description: `📚 Plan de développement des compétences

Pour tout plan de formation ou développement professionnel du personnel académique, une consultation est nécessaire.`,
      process: [
        `📌 Enjeux pour le personnel académique
- Améliorer les compétences pédagogiques.
- Faciliter le développement professionnel.`,
        `📄 Documents à demander à l'administration
- Projet de plan de formation.
- Critères de sélection, mesures d'accompagnement.
- Budget alloué.`,
        `🧠 Attitude à adopter
- Identifier les besoins prioritaires.
- Proposer des alternatives.
- Travailler en groupe.`,
        `🧩 Bonnes pratiques
✔ Suivre un calendrier précis.
✔ Impliquer les collègues dans l'identification des besoins.
✔ Exiger des suivis réguliers.`,
      ],
    },
    {
      consultationType: ConsultationType.ReglementInterieur,
      description: `📜 Règlement intérieur académique

Avant toute création ou modification du règlement académique, le conseil pédagogique doit être consulté.`,
      process: [
        `📌 Enjeux pour le personnel académique
- Prévenir les règles injustes.
- Garantir des procédures claires et équitables.`,
        `📄 Documents à demander à l'administration
- Projet de règlement ou modification.
- Motifs et objectifs de chaque règle.`,
        `🧠 Attitude à adopter
- Lire chaque article en détail.
- Comparer avec les pratiques existantes.
- S'opposer aux clauses problématiques.`,
        `🧩 Bonnes pratiques
✔ Proposer des formulations alternatives.
✔ Vérifier la cohérence avec les usages du département.`,
      ],
    },
    {
      consultationType: ConsultationType.AccordsCollectif,
      description: `🤝 Conventions et accords pédagogiques

Le conseil pédagogique est informé ou consulté sur les conventions et accords avec d'autres institutions.`,
      process: [
        `📌 Enjeux pour le personnel académique
- Éviter les engagements défavorables.
- Protéger les intérêts pédagogiques.`,
        `📄 Documents à demander à l'administration
- Projet de convention.
- Étude d'impact si existante.
- Position de la direction.`,
        `🧠 Attitude à adopter
- Lire la convention en détail.
- Demander des précisions sur chaque engagement.
- Rédiger un avis argumenté.`,
        `🧩 Bonnes pratiques
✔ Comparer avec les conventions précédentes.
✔ Échanger avec les collègues concernés.`,
      ],
    },
    {
      consultationType: ConsultationType.ActivitePartielle,
      description: `📝 Organisation des examens et évaluations

Avant toute modification significative de l'organisation des examens, le conseil pédagogique doit être consulté.`,
      process: [
        `📌 Enjeux pour le personnel académique
- Comprendre les changements proposés.
- Assurer l'équité pour les étudiants.
- Suivre les bonnes pratiques.`,
        `📄 Documents à demander à l'administration
- Nouveau calendrier des examens.
- Modalités d'évaluation proposées.
- Mesures pour les cas particuliers.`,
        `🧠 Attitude à adopter
- Vérifier la faisabilité pratique.
- Demander un suivi régulier.
- Proposer des solutions alternatives.`,
        `🧩 Bonnes pratiques
✔ S'assurer que tous les étudiants sont traités équitablement.
✔ Veiller aux délais et aux conditions de passation.`,
      ],
    },
    {
      consultationType: ConsultationType.DemenagementReorganisationSite,
      description: `📦 Aménagement des espaces d'enseignement

Tout projet ayant un impact sur l'organisation des salles de cours nécessite une consultation.`,
      process: [
        `📌 Enjeux pour le personnel académique
- Anticiper les perturbations.
- Négocier des améliorations.`,
        `📄 Documents à demander à l'administration
- Projet d'aménagement.
- Cartographie des impacts.
- Planning prévu.`,
        `🧠 Attitude à adopter
- Demander des garanties logistiques (équipement, accessibilité…).
- Impliquer les enseignants concernés.
- Proposer une phase test.`,
        `🧩 Bonnes pratiques
✔ Vérifier les mesures de transition.
✔ Suivre les conditions réelles post-changement.`,
      ],
    },
    {
      consultationType: ConsultationType.RisquesProfessionnels,
      description: `⚠️ Qualité de vie et conditions d'études

Le conseil pédagogique est systématiquement consulté sur les mesures liées au bien-être des étudiants et du personnel.`,
      process: [
        `📌 Enjeux pour le personnel académique
- Améliorer les conditions d'études et de travail.
- Protéger le bien-être de tous.`,
        `📄 Documents à demander à l'administration
- Enquêtes de satisfaction, rapports sur les conditions.
- Plans d'amélioration prévus.`,
        `🧠 Attitude à adopter
- Recueillir les retours du terrain.
- Proposer des mesures concrètes.
- Alerter si nécessaire.`,
        `🧩 Bonnes pratiques
✔ Impliquer les étudiants dans les retours.
✔ Vérifier la mise en œuvre réelle des mesures.`,
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
      console.log(data);

      await createConsultation(data);
      toast.dismiss();
      toast.success("La consultation a été créée avec succès!");
      handleSubmit();
    } catch (error) {
      console.error("Error creating consultation:", error);
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
