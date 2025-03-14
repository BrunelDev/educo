import ProjectsTodo from "./components/projectsTodo";

export default function Detail() {
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
