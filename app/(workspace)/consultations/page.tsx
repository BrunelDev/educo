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
      title: "Gestion de la qualité et des processus",
      barNumber: 1,
    },
    {
      title: "Accords et plans de sauvegarde de l’emploi (PSE)",
      barNumber: 1,
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
  ];
  const defaultConsultation: ConsultationDialogProps = {
    consultationType: ConsultationType.Accord,
    description:
      "Le CSE doit être consulté chaque année sur les grandes orientations stratégiques de l’entreprise. Cette consultation permet aux élus de comprendre la vision à moyen et long terme de la direction, notamment en ce qui concerne le développement de l’activité, les investissements, les éventuelles restructurations, et l’évolution des métiers et des compétences nécessaires.",
    process: [
      `📌 Quels documents doivent être remis ?
L’entreprise doit fournir aux élus du CSE un rapport d’orientation stratégique via la Base de Données Économiques et Sociales(BDES).Ce rapport doit contenir des éléments sur l’évolution du marché, les décisions stratégiques envisagées, les impacts sur l’emploi et la formation, ainsi que les moyens financiers mis en œuvre pour atteindre ces objectifs`,
      `📌 Droits du CSELe CSE peut solliciter un expert-comptable pour analyser la stratégie de l’entreprise et mesurer ses impacts sur l’emploi et les conditions de travail. L’expertise est financée par l’employeur. Les élus peuvent également poser des questions à la direction et formuler des propositions alternatives.`,
      `📌 Format de la consultationCette consultation se déroule en réunion plénière, où l’employeur présente les orientations stratégiques et répond aux questions des élus. Ces derniers doivent ensuite rendre un avis motivé, qui sera transmis à la direction`,
    ],
  };
  
  return (
    <div>
      <h6>Consultations obligatoires</h6>
      <div className="flex flex-wrap gap-2 mb-8">
        {consultationTiltes.map((consultationTitle, index) => (
          <DialogComponent
            key={consultationTitle.title + index}
            dialoTrigger={
              <ConsultationTitle
                title={consultationTitle.title}
                barNumber={consultationTitle.barNumber}
              />
            }
            dialogContent={<div></div>}
            className={""}
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
        dialoTrigger={<Button>Nouvelle Consultation</Button>}
        dialogContent={
          <ConsultationDialogContent consultation={defaultConsultation} />
        }
        dialogTitle={"Nouvelle Consultation"}
      />
    </div>
  );
}
