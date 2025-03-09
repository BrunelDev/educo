import Image from "next/image";

const actualities = [
  {
    title:
      "Nouvelle loi sur le dialogue social en entreprise – Ce qui change en 2025",
    source: "OpenAI.com",
    imageUrl: "/election.png",
    date: "15 feb 2025",
  },
  {
    title:
      "Nouvelle loi sur le dialogue social en entreprise – Ce qui change en 2025",
    source: "OpenAI.com",
    imageUrl: "/election.png",
    date: "15 feb 2025",
  },
  {
    title:
      "Nouvelle loi sur le dialogue social en entreprise – Ce qui change en 2025",
    source: "OpenAI.com",
    imageUrl: "/election.png",
    date: "15 feb 2025",
  },
  {
    title:
      "Nouvelle loi sur le dialogue social en entreprise – Ce qui change en 2025",
    source: "OpenAI.com",
    imageUrl: "/election.png",
    date: "15 feb 2025",
  },
  {
    title:
      "Nouvelle loi sur le dialogue social en entreprise – Ce qui change en 2025",
    source: "OpenAI.com",
    imageUrl: "/election.png",
    date: "15 feb 2025",
  },
  {
    title:
      "Nouvelle loi sur le dialogue social en entreprise – Ce qui change en 2025",
    source: "OpenAI.com",
    imageUrl: "/election.png",
    date: "15 feb 2025",
  },
  {
    title:
      "Nouvelle loi sur le dialogue social en entreprise – Ce qui change en 2025",
    source: "OpenAI.com",
    imageUrl: "/election.png",
    date: "15 feb 2025",
  },
  {
    title:
      "Nouvelle loi sur le dialogue social en entreprise – Ce qui change en 2025",
    source: "OpenAI.com",
    imageUrl: "/election.png",
    date: "15 feb 2025",
  },
];
export default function Actuality() {
  return (
    <div className="p-3 rounded-[12px] min-w-[276px] w-full  bg-[#FFFFFF99] flex flex-col gap-3">
      {actualities.map((actuality, index) => (
        <ActualityComponent
          key={actuality.title + index}
          title={actuality.title}
          source={actuality.source}
          imageUrl={actuality.imageUrl}
          date={actuality.date}
        />
      ))}
    </div>
  );
}

interface ActualityComponentProps {
  title: string;
  source: string;
  imageUrl: string;
  date: string;
}

const ActualityComponent = ({
  title,
  source,
  imageUrl,
  date,
}: ActualityComponentProps) => {
  return (
    <div className="flex gap-2">
      <Image src={imageUrl} width={60} height={60} alt="actuality image" className="h-[60px] w-[60px]" />
      <div className="flex flex-col text-white-800">
        <h6 className="font-semibold text-sm">{title}</h6>
        <div className="flex justify-between">
          <h6 className="font-medium text-[12px]">
            Source : <span className="text-coral-400">{source}</span>
          </h6>
          <h6>{date}</h6>
        </div>
      </div>
    </div>
  );
};
