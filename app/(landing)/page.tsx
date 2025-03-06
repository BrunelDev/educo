import Image from "next/image";
import Feature from "./components/feature";
import Navbar from "./components/navbar";

export default function LandingPage() {
  const features = [
    {
      imageUrl: "/feature1.png",
      title: (
        <>
          Un <span className="text-coral-500">tableau de bord intelligent</span> pour des actions ciblées et efficaces
        </>
      ),
      description:
        "Analysez automatiquement vos PV, DUERP, comptes rendus d’accidents du travail et bien plus encore. Obtenez des recommandations adaptées à votre secteur d’activité, optimisez votre gestion et prenez des décisions stratégiques en toute simplicité.",
    },
    {
      imageUrl: "/feature2.png",
      title: (
        <>
          Une <span className="text-coral-500">assistante IA française</span> ultra-réactive et un expert à votre écoute
        </>
      ),
      description:
        "Obtenez des réponses instantanées à vos questions juridiques et stratégiques grâce à notre intelligence artificielle, conçue pour protéger vos données. Et pour aller plus loin, un expert réel est disponible de 8h à 17h, avec un retour sous 24h pour une analyse approfondie et personnalisée.",
    },
    {
      imageUrl: "/feature3.png",
      title: <><span className="text-coral-500">Planification</span> intelligente de vos <span className="text-coral-500">réunions</span></>,
      description:
        "Organisez vos réunions en toute simplicité avec un agenda optimisé. Accédez aux obligations spécifiques pour chaque type de réunion et aux consultations obligatoires à prévoir dans l’année. Assurez-vous de respecter toutes les exigences réglementaires sans rien oublier.",
    },
    {
      imageUrl: "/feature4.png",
      title: <>Une <span className="text-coral-500">messagerie</span> interne sécurisée et structuré</>,
      description:
        "Discutez en toute confidentialité et collaborez efficacement grâce à une messagerie interne organisée par thématique. Centralisez vos échanges, partagez idées et documents stratégiques, et retrouvez rapidement les informations essentielles.",
    },
    {
      imageUrl: "/feature5.png",
      title: <>Un rendez-vous <span className="text-coral-500">formation</span> tous les 15 jours, <span className="text-coral-500">100 % gratuit</span></>,
      description:
        "Bénéficiez de formations régulières sur le droit du travail et la vie du CSE. Harcèlement, enquête RPS, NAO, prise de parole… Profitez d’un accompagnement régulier pour maîtriser vos missions et défendre vos mandats avec assurance.",
    },
    {
      imageUrl: "/feature6.png",
      title: <>Une <span className="text-coral-500">gestion des tâches</span> intelligente et proactive</>,
      description :
        "Suivez l’avancement de vos missions en toute simplicité grâce à une gestion des tâches optimisée. Notre IA analyse votre progression et vous propose des solutions et actions adaptées pour atteindre vos objectifs plus efficacement.",
    },
    {
      imageUrl: "/feature7.png",
      title: <>Tous vos <span className="text-coral-500">documents</span> centralisés en un clic</> ,
      description:
        "Gagnez en efficacité avec un drive dédié : archivez, retrouvez et partagez vos fichiers en toute sécurité, sans perte d’information.",
    },
    {
      imageUrl: "/feature8.png",
      title: <>Un <span className="text-coral-500">suivi trésorerie</span> intelligent et proactif</>,
      description:
        "Gardez une vision claire de vos finances avec un suivi en temps réel de votre trésorerie. Identifiez les éléments obligatoires à prévoir et recevez des suggestions stratégiques pour optimiser votre gestion financière.",
    },
  ];
  return (
    <>
      <div className="bg-[url(/home-bg.png)] h-fit">
        <div className="fixed top-0 left-0 w-full px-10 pt-10">
          <Navbar />
        </div>
        <div className="pt-[200px] w-1/2 mx-auto flex flex-col justify-center items-center gap-10 text-center">
          <h6 className="font-extrabold text-5xl text-white-800">
            La plateforme <span className="text-coral-500">intelligente</span>{" "}
            qui transforme votre <span className="text-coral-500">mandat</span>
          </h6>
          <p className="text-white-800">
            Gagnez en efficacité avec un outil conçu pour simplifier votre
            organisation, structurer vos réunions et vous aider à prendre des
            décisions éclairées.
          </p>
          <Image
            src="/macbook-home.png"
            height={503.5}
            width={827}
            alt="macbook image"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-20 gap-y-5 p-20">
        {features.map((feature, index) => {
          return (
            <Feature
              imageUrl={feature.imageUrl}
              title={feature.title}
              description={feature.description}
              key={feature.imageUrl + index}
            />
          );
        })}
      </div>
    </>
  );
}
