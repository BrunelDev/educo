import { ProjectProps, ProjectStatus } from '@/lib/types';
import ProjectCard from './components/project';

export default function Tasks() {
  

const projects: ProjectProps[] = [
  {
    title: "Mise en place du nouveau DUERP",
    description: "Évaluation et mise à jour du Document Unique d'Évaluation des Risques Professionnels",
    link: "/documents/duerp-2024",
    status: ProjectStatus.Ongoing
  },
  {
    title: "Organisation des élections CSE",
    description: "Préparation et coordination des élections des représentants du personnel",
    link: "/elections/2024",
    status: ProjectStatus.Ongoing
  },
  {
    title: "Négociation accord télétravail",
    description: "Révision de l'accord sur le télétravail post-covid",
    link: "/accords/teletravail",
    status: ProjectStatus.Completed
  },
  {
    title: "Audit qualité de vie au travail",
    description: "Enquête et analyse des conditions de travail",
    link: "/audits/qvt-2024",
    status: ProjectStatus.Ongoing
  },
  {
    title: "Formation SST",
    description: "Organisation des sessions de formation Sauveteur Secouriste du Travail",
    link: "/formations/sst",
    status: ProjectStatus.Completed
  },
  {
    title: "Révision règlement intérieur",
    description: "Mise à jour du règlement intérieur de l'entreprise",
    link: "/documents/reglement",
    status: ProjectStatus.Ongoing
  },
  {
    title: "Bilan social 2023",
    description: "Analyse et présentation du bilan social annuel",
    link: "/bilans/2023",
    status: ProjectStatus.Completed
  },
  {
    title: "Plan de formation 2024",
    description: "Élaboration du plan de développement des compétences",
    link: "/formation/plan-2024",
    status: ProjectStatus.Ongoing
  },
  {
    title: "Enquête RPS",
    description: "Évaluation des risques psychosociaux dans l'entreprise",
    link: "/enquetes/rps-2024",
    status: ProjectStatus.Ongoing
  }
];
  return (
    <div className='bg-[#ffffff78] py-5 px-4 rounded-[12px] w-full h-[85vh]'>
      <h6>Vos projets</h6>
      <div className='flex justify-between gap-y-6 flex-wrap'>
      {projects.map((project, index) => (
        <ProjectCard key={index} project={project} />
      ))}
      </div>
      
    </div>
  )
}
