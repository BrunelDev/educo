"use client"
import ProjectCard from './components/project';
import { getProjects, Project } from '@/lib/api/projets';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogComponent } from '@/app/_components/dialogComponent';
import ProjectForm from './components/projectForm';
import { getOrganization } from '@/lib/api/organisation';
import EmptyState from '@/app/_components/EmptyState';

export default function ProjectPage() {
  

  const [projects, setProjects] = useState<Project[]>()
  const [orgId, setOrg] = useState<number>()
  useEffect(() => {
    const fetchData = async () => {
      const data = await getProjects()
      setProjects(data)
      const teamId = await getOrganization()
      setOrg(teamId.organisation.id)
    }
    fetchData()
  }, [])
  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
        <h6 className="text-xl font-semibold mb-4 sm:mb-0">Vos projets</h6>
        <div>
          <DialogComponent
            dialogContent={<ProjectForm teamId={orgId ? orgId : 0} />}
            dialoTrigger={
              <Button className="bg-gradient-to-r from-[#FE6539] to-crimson-400 w-full sm:w-auto">
                Nouveau Projet
              </Button>
            }
            dialogTitle={null}
          />
        </div>
      </div>

      <div className='flex gap-4 flex-wrap'>
        {projects && projects.length > 0 ? (
          projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))
        ) : (
          <div className='w-full flex justify-center items-center py-10'>
            <EmptyState
              title={"Votre organisation n'a aucun projet pour le moment."}
              description={"Créez un projet pour commencer"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
