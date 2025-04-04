import Image from "next/image";
export default function Suggestions() {
  const suggestions = [
    "Quels sont les droits et obligations du CSE en matière de santé et sécurité ?",
    "Comment rédiger un procès-verbal de réunion CSE ?",
    "Quelles sont les étapes pour organiser une consultation des salariés ?",
    "Comment gérer les budgets de fonctionnement et ASC du CSE ?",
    "Quels recours en cas de litige avec l’employeur ?",
  ];
  return (
    <div className="bg-[#FFFFFF99] p-5 flex flex-col rounded-[12px] gap-3 relative w-full">
      <h6 className="text-crimson-500 text-lg font-medium">Suggestions IA</h6>
      <ul className="text-white-800 pl-5">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="list-disc w-fit">{suggestion}</li>
        ))}
      </ul>
      <Image unoptimized src={"/sparkles.svg"} width={100} height={100} alt="sparkle icon" className="absolute top-1/2 right-1 -translate-y-1/2"/>
    </div>
  );
}
