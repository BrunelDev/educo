import Actuality from "./components/actuality";
import Formations from "./components/formations";
import Reunions from "./components/reunions";
import Suggestions from "./components/suggestions";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex justify-between">
      <div className="w-[60%] flex flex-col gap-6">
          <Suggestions />
          <Formations />
          <Reunions/>

      </div>
      <div className="w-[38%]">
      <Actuality/>

      </div>
      </div>
      
    </div>
  );
}
