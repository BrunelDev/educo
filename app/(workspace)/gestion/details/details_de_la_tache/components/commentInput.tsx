"use client";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { useState } from "react";

export default function CommentInput() {
  const [comment, setComment] = useState("");
  return (
    <div className="relative">
      <div className="h-6 w-6 rounded-full bg-coral-100 flex items-center justify-center absolute top-3 left-3">
        <User size={15} color="#FF8A5C"/>
      </div>
      <Input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Ajouter un commenter"
              className="rounded-full bg-[#FFFFFF] h-12 placeholder:text-white-300 pl-12 border border-white-50"
              
      />
    </div>
  );
}
