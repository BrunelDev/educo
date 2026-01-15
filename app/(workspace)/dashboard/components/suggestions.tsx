import Image from "next/image";
export default function Suggestions() {
  const suggestions = [
    "Quelles sont les bonnes pratiques pour organiser une réunion pédagogique efficace ?",
    "Comment rédiger un procès-verbal de conseil de département ?",
    "Quelles sont les étapes pour organiser une évaluation des enseignements ?",
    "Comment gérer les ressources académiques et le budget du département ?",
    "Quels recours en cas de litige avec l'administration universitaire ?",
  ];
  return (
    <div className="bg-[#FFFFFF99] p-5 flex flex-col rounded-[12px] gap-3 relative w-full">
      <h6 className="text-crimson-500 text-lg font-medium">Suggestions IA</h6>
      <ul className="text-white-800 pl-5">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="list-disc w-fit">
            {suggestion}
          </li>
        ))}
      </ul>
      <Image
        src={"/sparkles.svg"}
        width={100}
        height={100}
        alt="sparkle icon"
        className="hidden sm:block absolute top-1/2 right-1 -translate-y-1/2"
      />
    </div>
  );
}
