"use client"
import { getWebinaires, Webinaire } from "@/lib/api/formations";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EmptyState from "@/app/_components/EmptyState";

export default function Formations() {
  const [formations, setFormations] = useState<Webinaire[]>();
  useEffect(() => {
    const fetchMeetings = async () => {
      const response = await getWebinaires();
      setFormations(response.results);
    };
    fetchMeetings();
  }, []);
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-[14px]">Nouvelles formations</h3>
        <Link href={"/formations"} className="underline text-xs text-coral-500">Tout Voir</Link>
      </div>
      {formations && formations?.length > 0 ? formations.slice(0, 3).map((formation, index) => {
        return (
          <FormationComponent
            key={formation.id + index}
            imageUrl={formation.image}
            title={formation.titre}
          />
        );
      }) :  (
                <EmptyState
                  title="Aucune formation pour le moment"
                  description="Il n'y a pas de formations disponibles pour le moment."
                />
              )}
    </div>
  );
}

interface FormationComponentProps {
  imageUrl: string;
  title: string;
}

const FormationComponent = ({ imageUrl, title }: FormationComponentProps) => {
  const router = useRouter()

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
      <div className="bg-white-50 hover:bg-white-100 cursor-pointer py-[6px] px-3 rounded-[8px] flex justify-center items-center" onClick={() => {
        router.push("/formations")
      }}>
        <h6 className="text-nowrap text-[10px] text-white-800 font-medium">
          En savoir plus
        </h6>
      </div>
    </div>
  );
};
