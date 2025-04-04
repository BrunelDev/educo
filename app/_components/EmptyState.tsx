import Image from "next/image";

interface EmptyStateProps {
  title: string;
  description: string;
  imagePath?: string;
}

export default function EmptyState({
  title,
  description,
  imagePath = "/empty-box.png",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-8 text-center">
      <Image
        src={imagePath}
        alt="Boite vide"
        width={120}
        height={120}
        className="mb-4"
      />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}
