import { formatDateToFrench } from "@/lib/functions";
import Image from "next/image";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import EmptyState from "@/app/_components/EmptyState";

interface Actuality {
  id: number;
  title: string;
  description: string;
  content: string;
  source: string;
  source_url: string;
  publication_date: string;
  image_url: string;
  is_from_rss: boolean;
  created_at: string;
  updated_at: string;
}
interface ActualityResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Actuality[];
}
export default function Actuality() {
  const [actualities, setActualities] = useState<Actuality[]>([]);
  useEffect(() => {
    const fetchActualities = async () => {
      try {
        const res = await api.get<ActualityResponse>("actualites/");
        setActualities(res.data.results);
      } catch (error) {
        console.error("Error fetching actualities:", error);
      }
    };
    fetchActualities();
  }, []);
  return (
    <div className="p-3 rounded-[12px] min-w-[276px] w-full  bg-[#FFFFFF99] flex flex-col gap-3">
      {actualities.length === 0 ? (
        <EmptyState
          title="Aucune actualité"
          description="Aucune actualité disponible"
        />
      ) : (
        actualities.map((actuality, index) => (
          <ActualityComponent
            key={actuality.title + index}
            title={actuality.title}
            source={actuality.source}
            sourceUrl={actuality.source_url}
            imageUrl={actuality.image_url}
            date={formatDateToFrench(actuality.publication_date)}
          />
        ))
      )}
    </div>
  );
}

interface ActualityComponentProps {
  title: string;
  source: string;
  sourceUrl: string;
  imageUrl: string;
  date: string;
}

const ActualityComponent = ({
  title,
  source,
  sourceUrl,
  imageUrl,
  date,
}: ActualityComponentProps) => {
  return (
    <div
      className="flex w-full gap-2 cursor-pointer"
      onClick={() => window.open(sourceUrl, "_blank")}
    >{
      imageUrl ? (
        <Image
          src={imageUrl}
          width={60}
          height={60}
          alt="actuality image"
          className="h-[60px] w-[60px]"
        />
      ) : (
        <div className="h-[60px] w-[60px] rounded-lg bg-gray-100"></div>
      )
    }
      <div className="flex flex-col justify-around text-white-800 w-full">
        <h6 className="font-semibold w-full text-sm">{title}</h6>
        <div className="flex flex-col sm:flex-row sm:justify-between w-full">
          <h6 className="font-medium text-[12px]">
            Source : <span className="text-coral-400">{source}</span>
          </h6>
          <h6 className="font-medium text-[12px]">{date}</h6>
        </div>
      </div>
    </div>
  );
};
