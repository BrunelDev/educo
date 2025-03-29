"use client"
import ProjectCard from './components/project';
import { getProjects, Project } from '@/lib/api/projets';
import { useEffect, useState } from 'react';

export default function Tasks() {
  

const [projects, setProjects] = useState<Project[]>()
  useEffect(() => {
    const fetchData = async () => {
      const data = await getProjects()
      setProjects(data)
    }
    fetchData()
  }, [])
  return (
    <div>
      <h6>Vos projets</h6>
      <div className='flex justify-between gap-y-6 flex-wrap'>
      {projects ? projects.map((project, index) => (
        <ProjectCard key={index} project={project} />
      )) : null}
      </div>
      
    </div>
  )
}
