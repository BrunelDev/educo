import { use } from "react";
import ProjectsTodo from "../components/projectsTodo";

export default function Detail({ params }: { params: Promise<{ id: string }> }) {
      const { id } = use(params);
  
  return (
    <div>
      <div className="flex justify-between">
        <ProjectsTodo />
        <ProjectsTodo />
        <ProjectsTodo />
      </div>
    </div>
  );
}
