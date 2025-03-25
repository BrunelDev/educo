import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileInputChangeEvent } from "@/lib/types";
import { ChevronRight, CirclePlus } from "lucide-react";
import { useState } from "react";

export default function AddOrganisation() {
  const [, /*logo*/ setLogo] = useState<File>();
  const handleFileInputChange = (e: FileInputChangeEvent): void => {
    const newFile = e.target.files[0];
    /*if (fileUrl && filesList.length > 0 && .includes(fileUrl)) {
          URL.revokeObjectURL(fileUrl);
        }*/
    if (newFile) {
      const url = URL.createObjectURL(newFile);
      setLogo(newFile);
      console.log(url);
    }
  };
  return (
    <div className="flex flex-col gap-5 px-20 py-4 w-[762px]">
      <div className="flex flex-col gap-3">
        <Label htmlFor="entrepriseName">Nom de l&apos;entreprise</Label>
        <Input id="entrepriseName" />
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-3 w-[48%]">
          <Label htmlFor="activity">Secteur d&apos;activité</Label>
          <Input id="activity" />
        </div>
        <div className="flex flex-col gap-3 w-[48%]">
          <Label htmlFor="entrepriseName">Taille</Label>
          <Input />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="entrepriseName">Nom de l&apos;entreprise</Label>
        <Input id="entrepriseName" />
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-3 w-[48%]">
          <Label htmlFor="activity">Secteur d&apos;activité</Label>
          <Input id="activity" />
        </div>
        <div className="flex flex-col gap-3 w-[48%]">
          <Label htmlFor="entrepriseName">Taille</Label>
          <Input />
        </div>
      </div>
      <div>
        <label className="font-medium text-white-800 text-xs">
          Pièces jointes
        </label>
        <div className="relative rounded-[8px] overflow-hidden border border-dashed border-white-300">
          <Input
            name="media"
            onChange={handleFileInputChange}
            type="file"
            className="w-full h-[136px] bg-white-50 cursor-pointer"
          />
          <div className="absolute top-0 left-0 w-full h-[135px] bg-white-50 flex flex-col gap-2 justify-center items-center pointer-events-none">
            <CirclePlus />
            <h6>Glissez et déposez ou cliquez ici pour choisir un fichier</h6>
            <div>Taille maximale 10MB</div>
          </div>
        </div>
      </div>
      <Button className="self-end bg-gradient-to-r from-[#FE6539] to-crimson-400">
        Enregistrer <ChevronRight />
      </Button>
    </div>
  );
}
