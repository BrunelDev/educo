"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadToS3 } from "@/lib/s3-upload";
import { FileInputChangeEvent } from "@/lib/types";
import { ChevronRight, CirclePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AddDocument({
  handleFileSubmit,
}: {
  handleFileSubmit: (fileurl: string) => Promise<void>;
}) {
  const [logoUrl, setLogoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileInputChange = async (
    e: FileInputChangeEvent
  ): Promise<void> => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Le fichier est trop volumineux. Taille maximale: 10MB");
        return;
      }
      try {
        const urls = await uploadToS3([file]);
        setLogoUrl(urls[0]);
        toast.success("Document téléchargé avec succès");
      } catch (error) {
        toast.error("Échec du téléchargement du document");
        console.error(error);
      }
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoUrl) {
      toast.error("Veuillez sélectionner un document");
      return;
    }

    setIsSubmitting(true);
    try {
      await handleFileSubmit(logoUrl);
      toast.success("Document enregistré avec succès");
      setLogoUrl("");
    } catch (error) {
      toast.error("Échec de l'enregistrement du document");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div>
        <label className="font-medium text-white-800 text-xs">
          Document
        </label>
        <div className="relative rounded-[8px] overflow-hidden border border-dashed border-white-300">
          <Input
            name="logo"
            onChange={handleFileInputChange}
            type="file"
            accept="image/*"
            className="w-full h-[136px] bg-white-50 cursor-pointer"
          />
          <div className="absolute top-0 left-0 w-full h-[135px] bg-white-50 flex flex-col gap-2 justify-center items-center pointer-events-none">
            <CirclePlus />
            <h6>Glissez et déposez ou cliquez ici pour choisir un fichier</h6>
            <div>Taille maximale 10MB</div>
          </div>
        </div>
      </div>
      <Button
        type="submit"
        disabled={isSubmitting || !logoUrl}
        className="self-end bg-gradient-to-r from-[#FE6539] to-crimson-400"
      >
        {isSubmitting ? "Enregistrement..." : "Enregistrer"} <ChevronRight />
      </Button>
    </form>
  );
}
