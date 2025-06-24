"use client";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import { CalendarDays, UserCircle, Link as LinkIcon } from "lucide-react";
import { getActualiteById } from "@/lib/api/actualites";
// Updated Actuality interface based on your schema
interface Actuality {
  id: number;
  title: string;
  description?: string;
  content: string;
  source: string; // This will be used for the author/source display
  source_url?: string;
  publication_date: string; // ISO date string
  image_url?: string;
  is_from_rss: boolean;
}

export default function ActualityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [actuality, setActuality] = useState<Actuality | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchActuality = async () => {
      try {
        setLoading(true);
        const actualityData = await getActualiteById(id);
        console.log("actualityData", actualityData);
        setActuality(actualityData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Une erreur est survenue lors de la récupération de l&apos;actualité"
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActuality();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p className="text-lg text-gray-600">
          Chargement de l&apos;actualité...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-red-600">
        <p className="text-xl font-semibold">Erreur</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!actuality) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p className="text-lg text-gray-700">Actualité non trouvée.</p>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-serif">
      {actuality.image_url && (
        <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={actuality.image_url}
            alt={`Image pour ${actuality.title}`}
            width={1200}
            height={630}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      )}

      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
        {actuality.title}
      </h1>

      <div className="flex flex-wrap items-center text-gray-600 text-sm mb-8 gap-x-6 gap-y-2">
        <div className="flex items-center">
          <UserCircle className="h-5 w-5 mr-2 text-sky-700" />
          <span>{actuality.source}</span>
        </div>
        <div className="flex items-center">
          <CalendarDays className="h-5 w-5 mr-2 text-sky-700" />
          <span>
            Publié le{" "}
            {new Date(actuality.publication_date).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        {actuality.source_url && (
          <div className="flex items-center">
            <LinkIcon className="h-5 w-5 mr-2 text-sky-700" />
            <a
              href={actuality.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-800 hover:underline"
            >
              Voir la source originale
            </a>
          </div>
        )}
      </div>

      {actuality.content && (
        <div
          className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: actuality.content }}
        />
      )}

      <div className="pb-16"></div>
    </article>
  );
}
