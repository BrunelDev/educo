"use client";

import { use, useEffect, useState } from "react";
import { getWebinaireById, Webinaire } from "@/lib/api/formations";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import GoBack from "@/app/_components/goback";

export default function WebinarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [webinar, setWebinar] = useState<Webinaire | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWebinar = async () => {
      try {
        setLoading(true);
        const webinarData = await getWebinaireById(Number(id));
        setWebinar(webinarData);
      } catch (err) {
        setError(
          "Une erreur est survenue lors de la récupération du webinaire"
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWebinar();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!webinar) {
    return (
      <div className="flex justify-center items-center h-screen">
        Webinar non trouvé
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <GoBack title="Retour" />
      {/* Optional Hero Image */}
      {webinar.image && (
        <div className="max-w-4xl mx-auto mb-8 px-4 sm:px-6 lg:px-8">
          <div className="relative aspect-[16/7] w-full overflow-hidden rounded-lg">
            <Image
              src={webinar.image}
              alt={`Image de couverture pour ${webinar.titre}`}
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
        </div>
      )}
      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
          {webinar.titre}
        </h1>

        {/* Subtitle: Date & Duration */}
        <div className="flex flex-wrap items-center text-gray-600 text-base mb-6 gap-x-4 gap-y-2">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-sky-700" />
            <span>
              {new Date(webinar.date).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-sky-700" />
            <span>{webinar.duree}</span>
          </div>
        </div>

        {/* Description */}
        {webinar.description && (
          <div className="prose prose-lg max-w-none text-gray-700 mb-8 leading-relaxed">
            <p>{webinar.description}</p>
          </div>
        )}

        {/* Speaker Information Section */}
        <section className="mt-10 pt-8 border-t border-gray-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-5">
            À propos du formateur
          </h2>
          <div>
            <p className="text-gray-600 font-semibold text-lg">
              Nom : {webinar.formateur_nom}
            </p>
            <p className="text-gray-600 font-semibold text-lg">
              Profession : {webinar.formateur_profession}
            </p>
          </div>
        </section>
      </div>
      <div className="pb-16"></div> {/* Bottom padding */}
    </div>
  );
}
