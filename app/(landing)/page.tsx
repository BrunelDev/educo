"use client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Menu,
  MessageSquare,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

function FeatureCard({
  imageUrl,
  title,
  description,
  index,
}: {
  imageUrl: string;
  title: React.ReactNode;
  description: string;
  index: number;
}) {
  return (
    <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/50 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Image
              src={imageUrl}
              width={600}
              height={450}
              alt="Feature"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
        </div>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-coral-500 to-crimson-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {index + 1}
            </div>
            <Badge
              variant="secondary"
              className="bg-coral-100 text-coral-700 hover:bg-coral-200"
            >
              Fonctionnalité
            </Badge>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-coral-600 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed text-base">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function Navbar() {
  const router = useRouter();
  return (
    <nav className="bg-white/90 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Image
              width={80}
              height={40}
              src="/logo.png"
              alt="educo"
              className="self-center"
            />
            <span className="text-2xl font-bold text-gray-900">Educo</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-coral-500 transition-colors font-medium relative group"
            >
              Fonctionnalités
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-coral-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="#about"
              className="text-gray-600 hover:text-coral-500 transition-colors font-medium relative group"
            >
              À propos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-coral-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <Button className="bg-gradient-to-r from-coral-500 to-crimson-500 hover:from-coral-600 hover:to-crimson-600 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            onClick={() => router.push("/login")}>
              Démarrer
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-6 mt-8">
                <a
                  href="#features"
                  className="text-gray-600 hover:text-coral-500 transition-colors font-medium text-lg"
                >
                  Fonctionnalités
                </a>
                <a
                  href="#about"
                  className="text-gray-600 hover:text-coral-500 transition-colors font-medium text-lg"
                >
                  À propos
                </a>
                <Button className="bg-gradient-to-r from-coral-500 to-crimson-500 text-white rounded-full font-semibold mt-4"
                onClick={() => router.push("/login")}>
                  Démarrer
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

export default function LandingPage() {
  const features = [
    {
      imageUrl: "/feature1.png",
      title: (
        <>
          Un <span className="text-coral-500">tableau de bord intelligent</span>{" "}
          pour une gestion scolaire optimale
        </>
      ),
      description:
        "Visualisez en temps réel les indicateurs clés de votre établissement : présences, résultats, activités et ressources. Prenez des décisions éclairées grâce à des analyses automatisées et des recommandations personnalisées.",
    },
    {
      imageUrl: "/feature2.png",
      title: (
        <>
          Une <span className="text-coral-500">assistance IA</span>{" "}
          ultra-réactive et un support expert
        </>
      ),
      description:
        "Obtenez des réponses instantanées sur la gestion pédagogique et administrative grâce à notre IA spécialisée. Pour un accompagnement approfondi, nos experts sont disponibles de 8h à 17h avec un retour garanti sous 24h.",
    },
    {
      imageUrl: "/feature3.png",
      title: (
        <>
          <span className="text-coral-500">Planification</span> intelligente des{" "}
          <span className="text-coral-500">cours et réunions</span>
        </>
      ),
      description:
        "Organisez emplois du temps, réunions pédagogiques et événements scolaires en toute simplicité. Gestion automatique des conflits d'horaires et notifications intelligentes pour tous les participants.",
    },
    {
      imageUrl: "/feature4.png",
      title: (
        <>
          Une <span className="text-coral-500">messagerie</span> collaborative
          sécurisée
        </>
      ),
      description:
        "Communiquez en toute confidentialité avec vos équipes pédagogiques. Créez des canaux par classe, matière ou projet. Partagez documents et ressources en temps réel dans un environnement sécurisé.",
    },
    {
      imageUrl: "/feature5.png",
      title: (
        <>
          Des <span className="text-coral-500">formations</span> continues,{" "}
          <span className="text-coral-500">100% gratuites</span>
        </>
      ),
      description:
        "Bénéficiez de webinaires réguliers sur les meilleures pratiques pédagogiques et l'utilisation optimale de la plateforme. Montez en compétences avec nos experts pour tirer le meilleur parti des outils collaboratifs.",
    },
    {
      imageUrl: "/feature6.png",
      title: (
        <>
          Une <span className="text-coral-500">gestion des tâches</span>{" "}
          intelligente et collaborative
        </>
      ),
      description:
        "Suivez l'avancement des projets pédagogiques et administratifs. Notre IA analyse votre progression et propose des solutions adaptées pour optimiser votre organisation et atteindre vos objectifs.",
    },
    {
      imageUrl: "/feature7.png",
      title: (
        <>
          Tous vos <span className="text-coral-500">documents</span> centralisés
          et accessibles
        </>
      ),
      description:
        "Stockez, organisez et partagez cours, devoirs, ressources pédagogiques et documents administratifs en toute sécurité. Accès rapide depuis n'importe quel appareil, où que vous soyez.",
    },
    {
      imageUrl: "/feature8.png",
      title: (
        <>
          Un <span className="text-coral-500">espace de visioconférence</span>{" "}
          intégré et performant
        </>
      ),
      description:
        "Organisez cours en ligne, réunions virtuelles et sessions de tutorat directement depuis la plateforme. Enregistrement des séances, partage d'écran et outils pédagogiques interactifs inclus.",
    },
  ];
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-coral-50 via-white to-crimson-50 py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-20 relative z-10">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <Badge className="bg-coral-100 text-coral-700 hover:bg-coral-200 px-4 py-2 text-sm font-semibold rounded-full">
              Plateforme collaborative pour établissements scolaires
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight">
              La plateforme{" "}
              <span className="bg-gradient-to-r from-coral-500 to-crimson-500 bg-clip-text text-transparent">
                collaborative
              </span>{" "}
              qui transforme votre{" "}
              <span className="bg-gradient-to-r from-coral-500 to-crimson-500 bg-clip-text text-transparent">
                établissement
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Gagnez en efficacité avec une solution complète pensée pour
              l'éducation. Communication, gestion documentaire, planification et
              collaboration en un seul endroit.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Button className="bg-gradient-to-r from-coral-500 to-crimson-500 hover:from-coral-600 hover:to-crimson-600 text-white px-8 lg:px-12 py-4 text-lg rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 font-semibold">
                Demander une démo
              </Button>
              <Button
                variant="outline"
                className="px-8 lg:px-12 py-4 text-lg rounded-full hover:shadow-xl transition-all duration-300 font-semibold border-2 border-gray-300 hover:border-coral-300"
              >
                En savoir plus
              </Button>
            </div>

            <div className="pt-16">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50">
                <Image
                  src="/macbook-home.png"
                  height={503.5}
                  width={827}
                  alt="Dashboard preview"
                  className="w-full h-auto hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 lg:py-28 bg-white border-y border-gray-100">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { value: "500+", label: "Établissements", icon: Users },
              { value: "50K+", label: "Utilisateurs actifs", icon: BarChart3 },
              { value: "99.9%", label: "Disponibilité", icon: CheckCircle2 },
              {
                value: "24/7",
                label: "Support technique",
                icon: MessageSquare,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center space-y-4 group hover:scale-105 transition-transform duration-300"
              >
                <stat.icon className="w-12 h-12 text-coral-500 mx-auto group-hover:scale-110 transition-transform" />
                <div className="text-4xl lg:text-5xl font-black text-coral-500">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-semibold text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-24 lg:py-32 px-6 lg:px-20 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="container mx-auto">
          <div className="text-center mb-20 space-y-6">
            <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 text-sm font-semibold rounded-full">
              Fonctionnalités puissantes
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 leading-tight">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Des outils puissants et intuitifs, conçus spécifiquement pour le
              milieu scolaire
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                imageUrl={feature.imageUrl}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* CTA Card */}
        <div className="container mx-auto mt-24 lg:mt-32">
          <Card className="bg-gradient-to-r from-coral-500 to-crimson-500 border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-8 lg:p-16 text-white relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 max-w-4xl space-y-8">
                <h2 className="text-3xl lg:text-5xl font-black leading-tight">
                  Prenez rendez-vous avec nous et découvrez toutes les
                  possibilités
                </h2>
                <p className="text-lg lg:text-xl text-white/90 leading-relaxed">
                  Explorez comment notre plateforme peut transformer la
                  collaboration et la gestion de votre établissement. Vous serez
                  surpris par tout ce que nous pouvons vous offrir !
                </p>
                <div className="flex flex-col sm:flex-row gap-6 pt-4">
                  <Button className="bg-white text-coral-600 hover:bg-gray-50 px-8 lg:px-12 py-4 text-lg rounded-full font-semibold shadow-lg hover:shadow-xl transition-all">
                    Ouvrir un compte
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-coral-600/30 backdrop-blur-sm text-white hover:bg-coral-600/40 px-8 lg:px-12 py-4 text-lg rounded-full font-semibold border-2 border-white/30 transition-all"
                  >
                    Prendre rendez-vous
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 lg:py-32 px-6 lg:px-20 bg-white">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start mb-16">
            <div className="space-y-8">
              <Badge className="bg-coral-100 text-coral-700 hover:bg-coral-200 px-4 py-2 text-sm font-semibold rounded-full">
                Notre histoire
              </Badge>
              <h2 className="text-3xl lg:text-5xl font-black text-gray-900 leading-tight">
                Qui sommes-nous ?
              </h2>
              <p className="text-xl lg:text-2xl font-semibold text-coral-500 leading-relaxed">
                Educo : Transformer la collaboration éducative avec innovation
                et engagement
              </p>
            </div>

            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Créée en 2020, Educo est née d'un constat simple : les
                établissements scolaires méritent des outils de collaboration
                aussi performants que ceux des grandes entreprises, mais adaptés
                à leurs besoins spécifiques.
              </p>

              <p>
                Nos fondateurs, issus du monde de l'éducation et de la
                technologie, ont réalisé que la transformation numérique des
                écoles nécessite plus qu'un simple logiciel. Il faut une vision
                globale, des outils intuitifs et un accompagnement dédié.
              </p>

              <p>
                C'est cette ambition qui nous guide. Nous créons des solutions
                qui placent la pédagogie et la collaboration au cœur de
                l'expérience éducative. Notre plateforme combine la puissance de
                Teams, la simplicité de Google Workspace et des fonctionnalités
                pensées spécifiquement pour le milieu scolaire.
              </p>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50">
            <Image
              src="/about_us-img.png"
              height={700}
              width={1160}
              alt="Notre équipe"
              className="w-full h-auto hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16 lg:py-20 px-6 lg:px-20 border-t border-gray-800">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  width={167}
                  height={48}
                  alt="The logo"
                />
              </div>
              <p className="text-gray-400 leading-relaxed">
                La plateforme collaborative pour l'éducation moderne
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6 text-lg">Produit</h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="hover:text-coral-500 transition-colors text-gray-400 hover:text-gray-200"
                  >
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-coral-500 transition-colors text-gray-400 hover:text-gray-200"
                  >
                    Tarifs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-coral-500 transition-colors text-gray-400 hover:text-gray-200"
                  >
                    Sécurité
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6 text-lg">
                Entreprise
              </h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="hover:text-coral-500 transition-colors text-gray-400 hover:text-gray-200"
                  >
                    À propos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-coral-500 transition-colors text-gray-400 hover:text-gray-200"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-coral-500 transition-colors text-gray-400 hover:text-gray-200"
                  >
                    Carrières
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6 text-lg">Support</h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="hover:text-coral-500 transition-colors text-gray-400 hover:text-gray-200"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-coral-500 transition-colors text-gray-400 hover:text-gray-200"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-coral-500 transition-colors text-gray-400 hover:text-gray-200"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p className="text-sm">© 2026 Educo. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
