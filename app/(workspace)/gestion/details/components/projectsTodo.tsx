import Project from "./project";
import ProjectGroup from "./projectGroup";

export default function ProjectsTodo() {
    const projects = [
        {
          title: "Projet A",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          status: "En cours",
        },
      ];
  return (
    <div className="flex flex-col gap-4 px-4">
          <ProjectGroup />
          {projects.map((project, index) => (
            <Project
              key={index}
              title={project.title}
              description={project.description}
            />
          ))}
    </div>
  );
}
