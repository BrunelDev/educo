import { Button } from "@/components/ui/button";
import { Webinaire } from "@/lib/api/formations";
import Image from "next/image";
import Link from "next/link";
import { subscribeToWebinaire } from "@/lib/api/formations";
import { toast } from "sonner";
import { Check } from "lucide-react";
interface WebinarCardProps {
  webinar: Webinaire;
}

export default function WebinarCard({ webinar }: WebinarCardProps) {
  return (
    <Link href={`/formations/webinaires/${webinar.id}`}>
      <div
        className={`h-[380px] w-[330px] rounded-[12px] relative group overflow-hidden cursor-pointer`}
      >
        <Image
          width={380}
          height={380}
          src={webinar.image ? webinar.image : "/webinarCard-bg.png"}
          alt="host profile"
          className="absolute -z-10 rounded-[12px] group-hover:scale-105 duration-300"
        />
        <WebinarCardBotton webinar={webinar} />
      </div>
    </Link>
  );
}

const WebinarCardBotton = ({ webinar }: WebinarCardProps) => {
  return (
    <div className="bg-gradient-to-b from-[#FFFFFFCC] to-white p-2 rounded-[12px] flex flex-col gap-3 h-fit absolute bottom-0 text-[10px] w-full">
      <div className="bg-[#FFFFFF99] flex items-center justify-center py-1 px-2 w-fit rounded-[8px]">
        <h6 className="text-xs font-semibold text-wrap truncate">
          {webinar.titre}
        </h6>
      </div>

      <h5 className="text-sm text-wrap">{webinar.titre}</h5>
      <p className="text-wrap">{webinar.description}</p>
      <div className="flex gap-2 items-center">
        <Image
          width={24}
          height={24}
          src={webinar.image ? webinar.image : "/hostImage.png"}
          alt="webinar profile"
          className="rounded-full"
        />
        <div>
          <h6>{webinar.formateur_nom}</h6>
          <p>{webinar.formateur_profession}</p>
        </div>
      </div>
      {!webinar.inscrit ? (
        <Button
          className="bg-gradient-to-r from-[#FE6539] to-crimson-400 rounded-[8px] h-8"
          onClick={async () => {
            try {
              console.log(webinar.id);
              await subscribeToWebinaire(webinar.id);
              toast.success("Inscription réussie");
            } catch (error) {
              console.error(error);
              toast.error("Une erreur est survenue lors de l'inscription");
            }
          }}
        >
          S&apos;inscrire
        </Button>
      ) : (
        <Button
          disabled
          className="bg-emerald-500 text-white rounded-[8px] h-8 flex items-center justify-center gap-2 hover:bg-emerald-500 cursor-not-allowed"
        >
          <Check className="h-4 w-4" />
          Inscrit
        </Button>
      )}
    </div>
  );
};
