"use client";
import { Select } from "@/app/_components/select";
import { Button } from "@/components/ui/button";
import { createConsultation } from "@/lib/api/consultation";
import { ConsultationDialog, ConsultationType } from "@/lib/types";
import { format } from "date-fns";
import { useState } from "react";

export default function ConsultationDialogContent({
  consultation,
}: ConsultationDialog) {
  const options: { value: ConsultationType }[] = [
    { value: ConsultationType.Accord },
    { value: ConsultationType.Fusion },
    { value: ConsultationType.Gestion },
    { value: ConsultationType.Introduction },
    { value: ConsultationType.Modification },
    { value: ConsultationType.Orientation },
    { value: ConsultationType.Politique },
    { value: ConsultationType.Situation },
  ];
  const [value, setValue] = useState<string>(ConsultationType.Accord);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateConsultation = async () => {
    try {
      setIsLoading(true);
      const formattedDate = format(new Date(), "yyyy-MM-dd");

      const data = {
        type_consultation: value,
        statut : "En attente",
        description: "Une consultation test",
        date_requise: formattedDate,
        participants: [],
      };

      const res = await createConsultation(data);
      console.log(res);
      // TODO: Add success toast notification
    } catch (error) {
      console.error("Error creating consultation:", error);
      // TODO: Add error toast notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
        <p className="text-sm">{consultation.description}</p>
      </div>
      <div className="flex pl-10 items-center bg-gradient-to-l from-[#FE6539] to-crimson-400 text-white-50 rounded-[8px] p-2 text-sm">
        <h6>Comment ca se passe</h6>
      </div>
      <div className="flex flex-col gap-4">
        {consultation.process.map((item, index) => (
          <pre
            key={index}
            className="whitespace-pre-wrap font-sans text-sm leading-relaxed"
          >
            {item}
          </pre>
        ))}
      </div>
      <Button onClick={handleCreateConsultation} disabled={isLoading}>
        {isLoading ? "Création..." : "Créer"}
      </Button>
    </div>
  );
}
