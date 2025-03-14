import { Select } from "@/app/_components/select";
import { ConsultationDialog, ConsultationType } from "@/lib/types";


export default function ConsultationDialogContent({consultation}: ConsultationDialog ) {
    const options: { value: ConsultationType }[] = [
    { value: ConsultationType.Accord },
    { value: ConsultationType.Fusion },
    { value: ConsultationType.Gestion },
    { value: ConsultationType.Introduction },
    { value: ConsultationType.Modification },
    { value: ConsultationType.Orientation },
    { value: ConsultationType.Politique },
    { value: ConsultationType.Situation },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-5">
        <h6>Type de consultation</h6>

        <Select
          placeholder={"Choisissez un type de consultation"}
          options={options}
          label={"Consultations"}
        />
        <p className="text-sm">{consultation.description}</p>
      </div>
      <div className="flex pl-10 items-center bg-gradient-to-l from-[#FE6539] to-crimson-400 text-white-50 rounded-[8px] p-2 text-sm"><h6>Comment ca se passe</h6></div>
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
    </div>
  );
}
