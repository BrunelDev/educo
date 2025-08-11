import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function GoBack({ title }: { title: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 cursor-pointer"
    >
      <ArrowLeft size={20} />
      <span className="font-semibold">{title}</span>
    </button>
  );
}
