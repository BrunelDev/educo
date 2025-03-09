import Image from "next/image";

const newFormations = [
  {
    imageUrl: "/election.png",
    title: "Maîtriser la Comptabilité du CSE en 3 Étapes",
    id: 1254,
  },
  {
    imageUrl: "/election.png",
    title: "Maîtriser la Comptabilité du CSE en 3 Étapes",
    id: 1254,
  },
  {
    imageUrl: "/election.png",
    title: "Maîtriser la Comptabilité du CSE en 3 Étapes",
    id: 1254,
  },
];
export default function Formations() {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-[14px]">Nouvelles formations</h3>
        <h6 className="underline text-xs text-coral-500">Tout Voir</h6>
      </div>
      {newFormations.map((formation, index) => {
        return (
          <FormationComponent
            key={formation.id + index}
            imageUrl={formation.imageUrl}
            title={formation.title}
          />
        );
      })}
    </div>
  );
}

interface FormationComponentProps {
  imageUrl: string;
  title: string;
}

const FormationComponent = ({ imageUrl, title }: FormationComponentProps) => {
  return (
    <div className="w-full flex justify-between p-2 rounded-[8px] bg-[#FFFFFF99]">
      <div className="flex gap-3">
        <Image
          src={imageUrl}
          width={60}
          height={60}
          alt="actuality image"
          className="h-[40px] w-[40px] rounded-lg"
        />
        <h6 className="flex items-center">{title}</h6>
      </div>
      <div className="bg-white-50 py-[6px] px-3 rounded-[8px] flex justify-center items-center">
        <h6 className="text-nowrap text-[10px] text-white-800 font-medium">
          En savoir plus
        </h6>
      </div>
    </div>
  );
};
