"use client";
import EmptyState from "@/app/_components/EmptyState";
import { getWebinaires, Webinaire } from "@/lib/api/formations";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Formations() {
  const [formations, setFormations] = useState<Webinaire[]>();
  useEffect(() => {
    const fetchMeetings = async () => {
      const response = await getWebinaires();
      setFormations(response.results);
      console.log(response.results);
    };
    fetchMeetings();
  }, []);
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-[14px]">Nouvelles formations</h3>
        <Link href={"/formations"} className="underline text-xs text-coral-500">
          Tout Voir
        </Link>
      </div>
      {formations && formations?.length > 0 ? (
        formations.slice(0, 3).map((formation, index) => {
          return (
            <FormationComponent
              key={formation.id + index}
              imageUrl={formation.image}
              title={formation.titre}
            />
          );
        })
      ) : (
        <EmptyState
          title="Aucune formation pour le moment"
          description="Il n'y a pas de formations disponibles pour le moment."
        />
      )}
    </div>
  );
}

interface FormationComponentProps {
  imageUrl: string | null;
  title: string;
}

const FormationComponent = ({ imageUrl, title }: FormationComponentProps) => {
  const router = useRouter();

  // Default placeholder image path
  const placeholderImage = "/webinarCard-bg.png";

  return (
    <div className="w-full flex flex-col sm:flex-row sm:justify-between items-start sm:items-center p-2 rounded-[8px] bg-[#FFFFFF99] gap-2 sm:gap-0">
      <div className="flex w-full gap-3">
        <div className="relative h-[40px] w-[40px] rounded-lg overflow-hidden bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              width={60}
              height={60}
              alt="formation image"
              className="h-full w-full object-cover"
              style={{
                objectFit: "cover",
                flexShrink: 0,
                minWidth: "60px",
                minHeight: "60px",
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-coral-50">
              <Image
                src={placeholderImage}
                width={60}
                height={60}
                alt="formation placeholder"
                className="h-full w-full object-cover opacity-70"
                style={{ flexShrink: 0, minWidth: "60px", minHeight: "60px" }}
              />
            </div>
          )}
        </div>

        <h6
          className="flex items-center"
          style={{ width: "calc(100% - 45px)" }}
        >
          {title}
        </h6>
      </div>
      <div
        className="bg-white-50 hover:bg-white-100 cursor-pointer py-[6px] px-3 rounded-[8px] flex justify-center items-center"
        onClick={() => {
          router.push("/formations");
        }}
      >
        <h6 className="text-nowrap text-[10px] text-white-800 font-medium">
          En savoir plus
        </h6>
      </div>
    </div>
  );
};
