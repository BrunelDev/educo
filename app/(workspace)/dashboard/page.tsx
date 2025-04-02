import Actuality from "./components/actuality";
import Formations from "./components/formations";
import Reunions from "./components/reunions";
import Suggestions from "./components/suggestions";


export default function DashboardPage() {
  
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <h6 className="text-sm">
      Bienvenu, <span className="font-bold text-[16px] text-coral-500">John DOE</span>

      </h6>
      <div className="flex justify-between">
      <div className="w-[60%] flex flex-col gap-6">
          <Suggestions />
          <Formations />
          <Reunions/>

      </div>
        <div className="w-[38%]">
      <h3 className="font-semibold text-[14px] mb-1">Actualités</h3>
          
      <Actuality/>

      </div>
      </div>
      
    </div>
  );
}
