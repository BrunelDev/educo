import { DialogComponent } from "@/app/_components/dialogComponent";
import { Button } from "@/components/ui/button";
import { ConsultationDialogProps, ConsultationType } from "@/lib/types";
import ConsultationDialogContent from "./components/consultationDialogContent";
import History from "./components/consultationHistory";
import ConsultationTitle from "./components/consultationTitle";

export default function Consultation() {
  const consultationTiltes = [
    {
      title: "Orientations stratégiques de l’entreprise",
      barNumber: 1,
    },
    {
      title: "Situation économique et financière",
      barNumber: 1,
    },
    {
      title: "Politique sociale, conditions de travail et emploi",
      barNumber: 2,
    },
    {
      title: "Introduction de nouvelles technologies",
      barNumber: 2,
    },
    {
      title: "Modifications importantes des conditions de travail",
      barNumber: 1,
    },
    {
      title: "Fusion, acquisition, cession d’entreprise",
      barNumber: 2,
    },
    {
      title: "Accords et plans de sauvegarde de l’emploi (PSE)",
      barNumber: 1,
    },
    {
      title: "Règlement intérieur",
      barNumber: 1,
    },
    {
      title: "Accord collectif",
      barNumber: 1,
    },
    {
      title: "Activité partielle (chômage partiel)",
      barNumber: 1,
    },
    {
      title: "Déménagement ou réorganisation de site",
      barNumber: 1,
    },
    {
      title: "Risques professionnels / santé / sécurité",
      barNumber: 1,
    },
  ];
  const defaultConsultation: ConsultationDialogProps = {
    consultationType: ConsultationType.Accord,
    description: `
Cette réunion a lieu une fois par an. L’employeur présente la vision stratégique de l’entreprise à moyen terme (généralement sur 3 ans). Le CSE rend un avis consultatif, même s’il n’a pas de pouvoir de blocage.
`,
    process: [
      `📌 Enjeux pour les élus
- Anticiper les conséquences sur l’emploi, les métiers, les implantations.
- Comprendre les risques liés à l’automatisation, à la réorganisation ou à la stratégie de croissance.
- Proposer des mesures d’accompagnement ou de formation.`,
      `📄 Documents à demander à l’employeur
- Plan stratégique (présentation ou rapport).
- Projets d’investissement, de réorganisation, d’innovation.
- Données économiques, prévisions d’emploi, politique RH.
`,
      `
🧠 Attitude à adopter
- Lire les documents en amont, préparer des questions.
- Demander une expertise si nécessaire (art. L2315-87).
- Donner un avis écrit, même critique.`,
      `🧩 Bonnes pratiques
✔ Anticipez la réunion en demandant les documents.
✔ Préparez une position commune.
✔ Comparez les annonces aux réalités du terrain.`,
    ],
  };
  const consultationList: ConsultationDialogProps[] = [
    {
      consultationType: ConsultationType.Orientation, // Changed from Accord to Orientation for the first example, assuming it was a placeholder
      description: `
Cette réunion a lieu une fois par an. L’employeur présente la vision stratégique de l’entreprise à moyen terme (généralement sur 3 ans). Le CSE rend un avis consultatif, même s’il n’a pas de pouvoir de blocage.
`,
      process: [
        `📌 Enjeux pour les élus
- Anticiper les conséquences sur l’emploi, les métiers, les implantations.
- Comprendre les risques liés à l’automatisation, à la réorganisation ou à la stratégie de croissance.
- Proposer des mesures d’accompagnement ou de formation.`,
        `📄 Documents à demander à l’employeur
- Plan stratégique (présentation ou rapport).
- Projets d’investissement, de réorganisation, d’innovation.
- Données économiques, prévisions d’emploi, politique RH.
`,
        `
🧠 Attitude à adopter
- Lire les documents en amont, préparer des questions.
- Demander une expertise si nécessaire (art. L2315-87).
- Donner un avis écrit, même critique.`,
        `🧩 Bonnes pratiques
✔ Anticipez la réunion en demandant les documents.
✔ Préparez une position commune.
✔ Comparez les annonces aux réalités du terrain.`,
      ],
    },
    {
      consultationType: ConsultationType.Situation,
      description: `📊 Réunion sur la situation économique et financière

Réunion annuelle pour examiner les comptes, résultats et perspectives économiques. Elle permet aux élus de comprendre la santé de l’entreprise.`,
      process: [
        `📌 Enjeux pour les élus
- Identifier les marges de manœuvre financières.
- Détecter les signaux faibles de difficultés ou opportunités.
- Poser les bases d'une stratégie sociale.`,
        `📄 Documents à demander à l’employeur
- Bilans, comptes de résultats, rapports du commissaire aux comptes.
- Budget prévisionnel.
- Présentation financière de la direction.`,
        `🧠 Attitude à adopter
- Demander une présentation pédagogique.
- Comparer avec les années précédentes.
- Appuyer sur les écarts et les risques.`,
        `🧩 Bonnes pratiques
✔ Demander les documents 8 jours avant.
✔ S'appuyer sur un expert-comptable si besoin.
✔ Proposer des alternatives.`,
      ],
    },
    {
      consultationType: ConsultationType.Politique,
      description: `👥 Réunion sur la politique sociale, l’emploi et les conditions de travail

Réunion annuelle pour faire le point sur les pratiques RH. L’objectif est de détecter les difficultés et faire avancer les droits sociaux.`,
      process: [
        `📌 Enjeux pour les élus
- Suivre l’évolution des effectifs, contrats, égalité, absentéisme.
- Identifier les risques sociaux et tensions organisationnelles.
- Proposer des actions correctives.`,
        `📄 Documents à demander à l’employeur
- Bilan social ou base de données économiques et sociales (BDES).
- Données sur les salaires, temps de travail, santé, égalité professionnelle.
- Plan de formation.`,
        `🧠 Attitude à adopter
- Croiser les chiffres avec les remontées terrain.
- Poser des questions concrètes.
- Mettre en avant les besoins des salariés.`,
        `🧩 Bonnes pratiques
✔ Organiser une relecture à plusieurs élus.
✔ Proposer des priorités d’action.
✔ Ne pas hésiter à relancer l’employeur après la réunion.`,
      ],
    },
    {
      consultationType: ConsultationType.Introduction,
      description: `🖥 Introduction de nouvelles technologies

Le CSE doit être consulté avant toute mise en place de nouvelles technologies (logiciels, machines, IA, etc.).`,
      process: [
        `📌 Enjeux pour les élus
- Anticiper les conséquences sur l’emploi, les compétences, la charge mentale.
- Évaluer les impacts sur les conditions de travail et la sécurité.`,
        `📄 Documents à demander à l’employeur
- Description des outils ou technologies.
- Objectifs visés, planning de déploiement.
- Évaluation des impacts sociaux.`,
        `🧠 Attitude à adopter
- Demander une simulation ou un test pilote.
- Proposer des accompagnements.
- S'appuyer sur une expertise si besoin.`,
        `🧩 Bonnes pratiques
✔ Rappeler que la consultation est obligatoire.
✔ Vérifier que la formation est prévue.
✔ Proposer une évaluation post-déploiement.`,
      ],
    },
    {
      consultationType: ConsultationType.Modification,
      description: `🔄 Modification des conditions de travail

Toute modification importante (horaires, lieu, organisation) impose une consultation du CSE.`,
      process: [
        `📌 Enjeux pour les élus
- Préserver la santé des salariés.
- Éviter les désorganisations ou tensions.`,
        `📄 Documents à demander à l’employeur
- Projet de changement.
- Justification, calendrier, impact RH.
- Mesures d’accompagnement.`,
        `🧠 Attitude à adopter
- Interroger les services ou métiers impactés.
- Vérifier la cohérence avec les accords existants.
- Proposer des ajustements.`,
        `🧩 Bonnes pratiques
✔ Faire des visites terrain si besoin.
✔ Prévoir une période d’expérimentation.
✔ Être vigilant sur les horaires et amplitudes.`,
      ],
    },
    {
      consultationType: ConsultationType.Fusion,
      description: `🔗 Fusions, cessions, acquisitions

Le CSE doit être informé et consulté avant toute opération de ce type.`,
      process: [
        `📌 Enjeux pour les élus
- Identifier les risques pour l’emploi, les statuts, les sites.
- Obtenir des garanties.`,
        `📄 Documents à demander à l’employeur
- Note de présentation du projet.
- Conséquences sociales et organisationnelles.
- Planning prévisionnel.`,
        `🧠 Attitude à adopter
- Poser des questions sur l’impact réel.
- Demander une expertise économique.
- Interpeller sur les engagements sociaux.`,
        `🧩 Bonnes pratiques
✔ Demander des garanties écrites.
✔ S’informer sur l’entreprise repreneuse.
✔ Mobiliser les salariés si besoin.`,
      ],
    },
    {
      consultationType: ConsultationType.Accord, // Mapping PSE to Accord as per enum
      description: `🚨 Plan de sauvegarde de l’emploi (PSE)

Quand un licenciement économique collectif est prévu, l’employeur doit consulter le CSE.`,
      process: [
        `📌 Enjeux pour les élus
- Sauvegarder un maximum d’emplois.
- Améliorer les mesures de reclassement.`,
        `📄 Documents à demander à l’employeur
- Projet de licenciement et PSE.
- Critères d’ordre, mesures d’accompagnement.
- Données économiques justifiant le plan.`,
        `🧠 Attitude à adopter
- Contester les suppressions injustifiées.
- Proposer des alternatives.
- Travailler avec un expert.`,
        `🧩 Bonnes pratiques
✔ Suivre un calendrier précis.
✔ Impliquer les salariés dans la défense de leurs postes.
✔ Exiger des comptes-rendus réguliers.`,
      ],
    },
    {
      consultationType: ConsultationType.ReglementInterieur,
      description: `📜 Règlement intérieur

Avant toute création ou modification du règlement, le CSE doit être consulté.`,
      process: [
        `📌 Enjeux pour les élus
- Prévenir les abus disciplinaires.
- Garantir des règles claires et légales.`,
        `📄 Documents à demander à l’employeur
- Projet de règlement ou modification.
- Motifs et objectifs de chaque règle.`,
        `🧠 Attitude à adopter
- Lire chaque article en détail.
- Comparer avec le Code du travail.
- S’opposer aux clauses abusives.`,
        `🧩 Bonnes pratiques
✔ Proposer des formulations alternatives.
✔ Vérifier la cohérence avec les usages de l’entreprise.`,
      ],
    },
    {
      consultationType: ConsultationType.Accord, // Mapping Accord collectif to Accord
      description: `🤝 Accord collectif (temps de travail, égalité…)

Le CSE est informé ou consulté sur certains accords selon leur nature.`,
      process: [
        `📌 Enjeux pour les élus
- Éviter les reculs sociaux.
- Protéger les équilibres vie pro/perso.`,
        `📄 Documents à demander à l’employeur
- Projet d’accord.
- Étude d’impact si existante.
- Position de la direction.`,
        `🧠 Attitude à adopter
- Lire l’accord ligne par ligne.
- Demander des précisions sur chaque changement.
- Rédiger un avis argumenté.`,
        `🧩 Bonnes pratiques
✔ Comparer avec l’accord précédent.
✔ Échanger avec les salariés concernés.`,
      ],
    },
    {
      consultationType: ConsultationType.ActivitePartielle,
      description: `⏳ Activité partielle (chômage partiel)

Avant toute demande d’activité partielle, l’employeur doit consulter le CSE.`,
      process: [
        `📌 Enjeux pour les élus
- Comprendre les causes réelles.
- Limiter les pertes de revenus.
- Suivre les engagements pris.`,
        `📄 Documents à demander à l’employeur
- Demande d’activité partielle.
- Catégories concernées, période visée.
- Engagements de maintien de l’emploi.`,
        `🧠 Attitude à adopter
- Vérifier les justifications.
- Demander un suivi régulier.
- Proposer des solutions alternatives.`,
        `🧩 Bonnes pratiques
✔ S’assurer que tous les services sont traités équitablement.
✔ Veiller à la durée et aux conditions de reprise.`,
      ],
    },
    {
      consultationType: ConsultationType.DemenagementReorganisationSite,
      description: `📦 Déménagement ou réorganisation de site

Tout projet ayant un impact sur l’organisation du travail nécessite une consultation.`,
      process: [
        `📌 Enjeux pour les élus
- Anticiper les risques de désorganisation.
- Négocier des compensations.`,
        `📄 Documents à demander à l’employeur
- Projet de réorganisation.
- Cartographie des impacts RH.
- Planning prévu.`,
        `🧠 Attitude à adopter
- Demander des garanties logistiques (temps de trajet, adaptation…).
- Impliquer les salariés.
- Proposer une phase test.`,
        `🧩 Bonnes pratiques
✔ Vérifier les mesures de transition.
✔ Suivre les conditions réelles post-changement.`,
      ],
    },
    {
      consultationType: ConsultationType.RisquesProfessionnels,
      description: `⚠️ Risques professionnels / santé / sécurité

Le CSE est systématiquement consulté sur les mesures liées à la sécurité, au DUERP, et à la prévention.`,
      process: [
        `📌 Enjeux pour les élus
- Éviter les accidents et maladies professionnelles.
- Protéger la santé physique et mentale.`,
        `📄 Documents à demander à l’employeur
- DUERP, plan de prévention, rapports AT/MP.
- Fiches de poste, résultats des contrôles.`,
        `🧠 Attitude à adopter
- Visiter les postes de travail.
- Proposer des mesures concrètes.
- Alerter si besoin.`,
        `🧩 Bonnes pratiques
✔ Impliquer les salariés dans les retours terrain.
✔ Vérifier la mise en œuvre réelle des mesures.`,
      ],
    },
  ];

  return (
    <div className="relative">
      <h6>Consultations obligatoires</h6>
      <div className="flex flex-wrap gap-2 mb-8">
        {consultationTiltes.map((consultationTitle, index) => (
          <DialogComponent
            className={
              "sm:max-w-[980px] flex items-center justify-center py-10 px-20"
            }
            key={consultationTitle.title + index}
            dialoTrigger={
              <ConsultationTitle
                title={consultationTitle.title}
                barNumber={consultationTitle.barNumber}
              />
            }
            dialogContent={
              <ConsultationDialogContent
                consultation={consultationList[index]}
              />
            }
            dialogTitle={null}
          />
        ))}
      </div>
      <div>
        <History />
      </div>
      <DialogComponent
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
          <ConsultationDialogContent consultation={defaultConsultation} />
        }
        dialogTitle={""}
      />
    </div>
  );
}
