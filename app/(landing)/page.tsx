import { Button } from "@/components/ui/button";
import Image from "next/image";
import Feature from "./components/feature";
import Navbar from "./components/navbar";

export default function LandingPage() {
  const features = [
    {
      imageUrl: "/feature1.png",
      title: (
        <>
          Un <span className="text-coral-500">tableau de bord intelligent</span>{" "}
          pour des actions ciblées et efficaces
        </>
      ),
      description:
        "Analysez automatiquement vos PV, DUERP, comptes rendus d’accidents du travail et bien plus encore. Obtenez des recommandations adaptées à votre secteur d’activité, optimisez votre gestion et prenez des décisions stratégiques en toute simplicité.",
    },
    {
      imageUrl: "/feature2.png",
      title: (
        <>
          Une <span className="text-coral-500">assistante IA française</span>{" "}
          ultra-réactive et un expert à votre écoute
        </>
      ),
      description:
        "Obtenez des réponses instantanées à vos questions juridiques et stratégiques grâce à notre intelligence artificielle, conçue pour protéger vos données. Et pour aller plus loin, un expert réel est disponible de 8h à 17h, avec un retour sous 24h pour une analyse approfondie et personnalisée.",
    },
    {
      imageUrl: "/feature3.png",
      title: (
        <>
          <span className="text-coral-500">Planification</span> intelligente de
          vos <span className="text-coral-500">réunions</span>
        </>
      ),
      description:
        "Organisez vos réunions en toute simplicité avec un agenda optimisé. Accédez aux obligations spécifiques pour chaque type de réunion et aux consultations obligatoires à prévoir dans l’année. Assurez-vous de respecter toutes les exigences réglementaires sans rien oublier.",
    },
    {
      imageUrl: "/feature4.png",
      title: (
        <>
          Une <span className="text-coral-500">messagerie</span> interne
          sécurisée et structuré
        </>
      ),
      description:
        "Discutez en toute confidentialité et collaborez efficacement grâce à une messagerie interne organisée par thématique. Centralisez vos échanges, partagez idées et documents stratégiques, et retrouvez rapidement les informations essentielles.",
    },
    {
      imageUrl: "/feature5.png",
      title: (
        <>
          Un rendez-vous <span className="text-coral-500">formation</span> tous
          les 15 jours, <span className="text-coral-500">100 % gratuit</span>
        </>
      ),
      description:
        "Bénéficiez de formations régulières sur le droit du travail et la vie du CSE. Harcèlement, enquête RPS, NAO, prise de parole… Profitez d’un accompagnement régulier pour maîtriser vos missions et défendre vos mandats avec assurance.",
    },
    {
      imageUrl: "/feature6.png",
      title: (
        <>
          Une <span className="text-coral-500">gestion des tâches</span>{" "}
          intelligente et proactive
        </>
      ),
      description:
        "Suivez l’avancement de vos missions en toute simplicité grâce à une gestion des tâches optimisée. Notre IA analyse votre progression et vous propose des solutions et actions adaptées pour atteindre vos objectifs plus efficacement.",
    },
    {
      imageUrl: "/feature7.png",
      title: (
        <>
          Tous vos <span className="text-coral-500">documents</span> centralisés
          en un clic
        </>
      ),
      description:
        "Gagnez en efficacité avec un drive dédié : archivez, retrouvez et partagez vos fichiers en toute sécurité, sans perte d’information.",
    },
    {
      imageUrl: "/feature8.png",
      title: (
        <>
          Un <span className="text-coral-500">suivi trésorerie</span>{" "}
          intelligent et proactif
        </>
      ),
      description:
        "Gardez une vision claire de vos finances avec un suivi en temps réel de votre trésorerie. Identifiez les éléments obligatoires à prévoir et recevez des suggestions stratégiques pour optimiser votre gestion financière.",
    },
  ];
  return (
    <>
      <div className="bg-[url(/home-bg.png)] h-fit">
        <div className="fixed top-0 left-0 w-full px-20 pt-10">
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
      <div className="p-20 bg-[url(/features-bg.png)]">
        <div className="w-full flex justify-between flex-wrap gap-y-10">
          {features.map((feature, index) => {
            return (
              <div className="sm:w-[42%]" key={feature.imageUrl + index}>
                <Feature
                  imageUrl={feature.imageUrl}
                  title={feature.title}
                  description={feature.description}
                />
              </div>
            );
          })}
        </div>
        <div className="container bg-gradient-to-r from-[#FE6539] to-crimson-400 w-full flex flex-col justify-between text-white-50 h-[280px] rounded-2xl p-10 mt-20">
          <h1 className="font-extrabold text-4xl">
            Prenez rendez-vous avec nous et explorez tout le potentiel de notre
            solution
          </h1>
          <p className="font-medium text-sm">
            Découvrez toutes les fonctionnalités conçues pour optimiser la
            gestion de votre mandat. Vous serez surpris par tout ce que notre
            plateforme peut vous oﬀrir ! 🚀
          </p>
          <div className="flex gap-5">
            <Button className="bg-crimson-50 text-[#000000B2] h-[50px] py-3 px-10 rounded-full">
              Ouvrir un compte
            </Button>
            <Button className="bg-[#F8F8F84D] h-[50px] py-3 px-10 rounded-full">
              Prendre rendez-vous
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-[url(/about_us-bg.png)] p-20 h-fit">
        <div className="flex flex-row flex-wrap justify-between">
          <div className="w-[45%]">
            <h6>Qui sommes-nous ?</h6>
            <p>
              GROUP SUCCESS : Transformer les Conditions de Travail avec
              Stratégie et Engagement
            </p>
          </div>
          <div className="flex flex-col gap-5 w-[45%]">
            <p>
              Créé en 2017, GROUP SUCCESS est né d’un constat évident : trop
              d’entreprises fonctionnent sans une véritable stratégie RH, et les
              formations manquent d’impact et de pertinence pour assurer une
              réelle montée en compétences des acteurs de l’entreprise.
            </p>

            <p>
              Nos fondateurs, après un passage dans le conseil en entreprise,
              ont réalisé que la transformation des environnements de travail
              repose entre les mains des dirigeants, des RH et des élus CSE.
              Mais pour impulser un véritable changement, il faut plus qu’une
              volonté : il faut un accompagnement stratégique, des outils
              adaptés et une vision claire.
            </p>

            <p>
              C’est cette ambition qui nous anime. Grâce à nos différentes
              entités, nous accompagnons les entreprises et les élus CSE avec
              une méthodologie éprouvée qui place l’humain au cœur de la
              stratégie d’entreprise. Nous avons conçu des formations
              immersives, impactantes et ludiques, parce que nous croyons
              fermement au dialogue, à l’expérience et à la montée en
              compétences pour transformer durablement les organisations.
            </p>
          </div>
          
        </div>
        <Image
            src={"/about_us-img.png"}
            height={1160}
            width={700}
            alt="about us image"
            className="rounded-2xl w-full"
          />
      </div>
    </>
  );
}
