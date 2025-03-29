import { Ressource } from "@/lib/api/formations";

interface RessourceCardProps {
  ressource : Ressource
}
export const RessourceCard = ({ressource} : RessourceCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm w-[400px] h-[200px] overflow-hidden">
      <div className="flex gap-2">
        <div className="w-16 h-[220px] bg-purple-400 flex-shrink-0"></div>
        <div className="flex flex-col items-center justify-center gap-3 p-2">
          <h3 className="font-medium text-gray-900 mb-1">
            {ressource.titre}
          </h3>
          <p className="text-sm text-gray-500 mb-2">
            {ressource.description}
          </p>
          <div className="flex items-center">
            <span className="text-sm text-gray-500">Réalisé par</span>
            <span className="text-sm font-medium text-gray-900 ml-1">{ressource.auteur}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
