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
    <div className="relative">
      <h6>Vos projets</h6>
      <div className='flex gap-x-4 gap-y-6 flex-wrap'>
      {projects ? projects.map((project, index) => (
        <ProjectCard key={index} project={project} />
      )) : <div>
        <EmptyState title={"Votre organisation n'a aucun projet pour le moment."} description={"Créez un projet pour commencer"}/></div>}
      </div>
      <div className='absolute right-6 -top-[62px]'>
      <DialogComponent
          dialogContent={<ProjectForm teamId={orgId ? orgId : 0} />}
        dialoTrigger={<Button className="bg-gradient-to-r from-[#FE6539] to-crimson-400">Nouveau Projet</Button>} dialogTitle={null}      />
      </div>
      
      
    </div>
  )
}
