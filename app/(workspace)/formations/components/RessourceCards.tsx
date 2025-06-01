import { Ressource } from "@/lib/api/formations";
import { ExternalLink } from "lucide-react";

interface RessourceCardProps {
  ressource: Ressource;
}
export const RessourceCard = ({ ressource }: RessourceCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm w-[400px] h-[200px] overflow-hidden">
      <div className="flex gap-2">
        <div className="w-16 h-[220px] bg-purple-400 flex-shrink-0"></div>
        <div className="flex flex-col items-center justify-center gap-3 p-2">
          <h3 className="font-medium text-gray-900 mb-1">{ressource.titre}</h3>
          <p className="text-sm text-gray-500 mb-2">{ressource.description}</p>
          <div className="flex items-center mb-2">
            <span className="text-sm text-gray-500">Réalisé par</span>
            <span className="text-sm font-medium text-gray-900 ml-1">
              {ressource.auteur}
            </span>
          </div>
          <a
            href={ressource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-coral-500 hover:text-coral-700 transition-colors"
          >
            <ExternalLink size={16} />
            Accéder à la ressource
          </a>
        </div>
      </div>
    </div>
  );
};
