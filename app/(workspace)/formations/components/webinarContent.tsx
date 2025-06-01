import WebinarCard from "./webinarCard";
import { useEffect, useState } from "react";
import { getWebinaires, Webinaire } from "@/lib/api/formations";

export default function WebinarContent() {
  const [allWebinars, setAllWebinars] = useState<Webinaire[]>([]);
  const [upcomingWebinars, setUpcomingWebinars] = useState<Webinaire[]>([]);
  const [pastWebinars, setPastWebinars] = useState<Webinaire[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndSetWebinars = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getWebinaires();
        setAllWebinars(response.results || []);
      } catch (err: unknown) {
        console.error("Error fetching webinars:", err);
        setError("Impossible de charger les webinaires. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };
    fetchAndSetWebinars();
  }, []);

  useEffect(() => {
    if (allWebinars.length > 0) {
      const now = new Date();
      const upcoming: Webinaire[] = [];
      const past: Webinaire[] = [];

      allWebinars.forEach((webinar) => {
        const webinarDate = new Date(webinar.date);
        if (webinarDate >= now) {
          upcoming.push(webinar);
        } else {
          past.push(webinar);
        }
      });

      setUpcomingWebinars(upcoming);
      setPastWebinars(past);
    }
  }, [allWebinars]);

  if (loading) {
    return <p className="text-center py-10">Chargement des webinaires...</p>;
  }

  if (error) {
    return <p className="text-center py-10 text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h2 className="text-2xl font-semibold mb-6">Prochains Webinaires</h2>
        {upcomingWebinars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcomingWebinars.map((webinar) => (
              <WebinarCard key={webinar.id} webinar={webinar} />
            ))}
          </div>
        ) : (
          <p>Aucun webinaire à venir pour le moment.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Webinaires Passés</h2>
        {pastWebinars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pastWebinars.map((webinar) => (
              <WebinarCard key={webinar.id} webinar={webinar} />
            ))}
          </div>
        ) : (
          <p>Aucun webinaire passé trouvé.</p>
        )}
      </section>
    </div>
  );
}
