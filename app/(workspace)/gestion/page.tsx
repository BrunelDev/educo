"use client";
import { DialogComponent } from "@/app/_components/dialogComponent";
import EmptyState from "@/app/_components/EmptyState";
import { Button } from "@/components/ui/button";
import { getOrganization } from "@/lib/api/organisation";
import { getProjects, Project } from "@/lib/api/projets";
import { useEffect, useState } from "react";
import ProjectCard from "./components/project";
import ProjectForm from "./components/projectForm";

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>();
  const [orgId, setOrg] = useState<number>();
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const team = await getOrganization();
      if (!team || !team.organisation) return;
      setOrg(team.organisation.id);
      const data = await getProjects(team.organisation.id);
      setProjects(data);
    };
    fetchData();
  }, [isProjectDialogOpen, refresh]);

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
        <h6 className="text-xl font-semibold mb-4 sm:mb-0">Vos projets</h6>
        <div>
          <DialogComponent
            open={isProjectDialogOpen}
            onOpenChange={setIsProjectDialogOpen}
            dialogContent={
              <ProjectForm
                teamId={orgId ? orgId : 0}
                onSubmit={() => {
                  setIsProjectDialogOpen(false);
                }}
              />
            }
            dialoTrigger={
              <Button className="bg-gradient-to-r from-[#FE6539] to-crimson-400 w-full sm:w-auto">
                Nouveau Projet
              </Button>
            }
            dialogTitle={null}
          />
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        {projects &&
        projects.filter((project) => project.status !== "termine").length >
          0 ? (
          projects
            .filter((project) => project.status !== "termine")
            .map((project, index) => (
              <ProjectCard
                key={index}
                project={project}
                onSubmitProject={() => setRefresh(!refresh)}
              />
            ))
        ) : (
          <div className="w-full flex justify-center items-center py-10">
            <EmptyState
              title={"Votre organisation n'a aucun projet actif pour le moment."}
              description={"Créez un projet pour commencer"}
            />
          </div>
        )}
      </div>
      <h6 className="text-xl font-semibold my-6">Projets achevés</h6>
      <div className="flex gap-4 flex-wrap">
        {projects &&
        projects.filter((project) => project.status === "termine").length >
          0 ? (
          projects
            .filter((project) => project.status === "termine")
            .map((project, index) => (
              <ProjectCard
                key={index}
                project={project}
                onSubmitProject={() => setRefresh(!refresh)}
              />
            ))
        ) : (
          <div className="w-full flex justify-center items-center py-10">
            <EmptyState
              title={"Votre organisation n'a aucun projet achevé pour le moment."}
              description={"Vos projet achevés apparaîtront ici."}
            />
          </div>
        )}
      </div>
    </div>
  );
}
