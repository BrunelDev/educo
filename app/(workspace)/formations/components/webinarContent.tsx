import { WebinarCardProps } from "@/lib/types";
import WebinarCard from "./webinarCard";

export default function WebinarContent() {
  const webinars: WebinarCardProps[] = [
    {
      tag: "Comptabilité",
      title: "Maîtriser la Comptabilité du CSE en 3 Étapes",
      description:
        "Apprenez à gérer les budgets du CSE, à suivre les comptes et à préparer un bilan financier annuel clair et conforme.",
      hostName: "William Anderson",
      hostProfileImageUrl: "/hostImage.png",
      hostProfession: "Expert-Comptable spécialisé dans les CSE",
      backgroundImageUrl: "/webinarCard-bg.png",
      id: "1248",
    },
    {
      tag: "Formation",
      title: "Créer une entreprise de confiance avec un CSE",
      description:
        "Découvrez comment vous pouvez utiliser votre CSE pour améliorer votre comptabilité, augmenter votre productivité et réduire vos co��ts.",
      hostName: "Micheline Muller",
      hostProfileImageUrl: "/hostImage.png",
      hostProfession: "Ingénieur en Comptabilité spécialisé dans les CSE",
      backgroundImageUrl: "/webinarCard-bg.png",
      id: "1249",
    },
    {
      tag: "Formation",
      title: "Créer une entreprise de confiance avec un CSE",
      description:
        "Découvrez comment vous pouvez utiliser votre CSE pour améliorer votre comptabilité, augmenter votre productivité et réduire vos co��ts.",
      hostName: "Micheline Muller",
      hostProfileImageUrl: "/hostImage.png",
      hostProfession: "Ingénieur en Comptabilité spécialisé dans les CSE",
      backgroundImageUrl: "/webinarCard-bg.png",
      id: "1249",
    },
  ];
  return (
      <div className="flex flex-col gap-3">
          <h4 className="font-bold text-[18px]">Regardez nos sessions d&apos;experts à la demande</h4>
      <h6 className="font-medium">
        Vous avez manqué l&apos;un de nos webinaires en direct ? Ne vous
        inquiétez pas, vous pouvez trouver une liste de sessions à la demande
        ici !
      </h6>
      <div>
        <h6 className="mb-3 text-sm font-semibold">À venir</h6>
        <div className="flex flex-wrap justify-between">
          {webinars.map((webinar, index) => (
            <WebinarCard webinar={webinar} key={webinar.id + index} />
          ))}
        </div>
      </div><div>
              <h6 className="mb-3 text-sm font-semibold">
              Recommandés pour vous
        </h6>
        <div className="flex flex-wrap justify-between">
          {webinars.map((webinar, index) => (
            <WebinarCard webinar={webinar} key={webinar.id + index} />
          ))}
        </div>
      </div>
    </div>
  );
}
