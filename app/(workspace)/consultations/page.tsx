"use client";
import { DialogComponent } from "@/app/_components/dialogComponent";
import { Button } from "@/components/ui/button";
import { ConsultationDialogProps, ConsultationType } from "@/lib/types";
import { useState } from "react";
import ConsultationDialogContent from "./components/consultationDialogContent";
import History from "./components/consultationHistory";
import { ConsultationTitle } from "./components/consultationTitle";

export default function Consultation() {
  const consultationTiltes = [
    {
      title: "Orientations pédagogiques du département",
      barNumber: 1,
    },
    {
      title: "Budget et ressources académiques",
      barNumber: 1,
    },
    {
      title: "Politique de formation et conditions d'enseignement",
      barNumber: 2,
    },
    {
      title: "Intégration de nouvelles technologies pédagogiques",
      barNumber: 2,
    },
    {
      title: "Modifications des programmes d'enseignement",
      barNumber: 1,
    },
    {
      title: "Partenariats et coopérations universitaires",
      barNumber: 2,
    },
    {
      title: "Plan de développement des compétences",
      barNumber: 1,
    },
    {
      title: "Règlement intérieur académique",
      barNumber: 1,
    },
    {
      title: "Conventions et accords pédagogiques",
      barNumber: 1,
    },
    {
      title: "Organisation des examens et évaluations",
      barNumber: 1,
    },
    {
      title: "Aménagement des espaces d'enseignement",
      barNumber: 1,
    },
    {
      title: "Qualité de vie et conditions d'études",
      barNumber: 1,
    },
  ];
  const defaultConsultation: ConsultationDialogProps = {
    consultationType: ConsultationType.Accord,
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
- Données sur les effectifs étudiants, besoins en ressources.
`,
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
  };
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
- Justification, calendrier, impact sur les courses.
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
- Travailler en équipe.`,
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

  const [isNewConsultationDialogOpen, setIsNewConsultationDialogOpen] =
    useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="relative">
      <h6>Consultations académiques</h6>
      <div className="flex flex-wrap gap-2 mb-8">
        {consultationTiltes.map((consultationTitle, index) => (
          <DialogComponent
            open={currentIndex === index}
            onOpenChange={(open: boolean) => {
              if (open) {
                setCurrentIndex(index);
              } else {
                setCurrentIndex(null);
              }
            }}
            className={
              "sm:max-w-[980px] flex items-center justify-center py-10 px-20"
            }
            key={consultationTitle.title + index}
            dialoTrigger={
              <div
                className="w-full sm:w-[300px]"
                onClick={() => {
                  console.log("index", index);
                  console.log(
                    "Content",
                    consultationList[index].consultationType
                  );
                  setCurrentIndex(index);
                }}
              >
                <ConsultationTitle
                  title={consultationTitle.title}
                  barNumber={consultationTitle.barNumber}
                />
              </div>
            }
            dialogContent={
              <ConsultationDialogContent
                consultation={consultationList[index]}
                handleSubmit={() => {
                  setCurrentIndex(null);
                  setRefresh(!refresh);
                }}
              />
            }
            dialogTitle={null}
          />
        ))}
      </div>
      <div>
        <History refresh={refresh} />
      </div>
      <DialogComponent
        dialogTitle={null}
        open={isNewConsultationDialogOpen}
        onOpenChange={setIsNewConsultationDialogOpen}
        className={
          "sm:max-w-[980px] flex items-center justify-center py-10 px-20"
        }
        dialoTrigger={
          <Button
            className={`cursor-pointer bg-gradient-to-r from-[#FE6539] to-crimson-400 w-full mt-4 md:w-fit md:absolute md:-top-10 md:right-6 md:mt-0`}
            variant={"default"}
          >
            Nouvelle Consultation
          </Button>
        }
        dialogContent={
          <ConsultationDialogContent
            consultation={defaultConsultation}
            handleSubmit={() => {
              setIsNewConsultationDialogOpen(false);
              setRefresh(!refresh);
            }}
          />
        }
      />
    </div>
  );
}
