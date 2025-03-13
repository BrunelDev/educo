import { DialogComponent } from "@/app/_components/dialogComponent";
import ConsultationTitle from "./components/consultationTitle";
import History from "./components/consultationHistory";

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
  return (
    <div>
      <h6>Consultations obligatoires</h6>
      <div className="flex flex-wrap justify-between gap-y-4">
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
    </div>
  );
}
