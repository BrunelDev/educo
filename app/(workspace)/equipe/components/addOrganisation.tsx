import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createOrganization } from "@/lib/api/organisation";
import { uploadToS3 } from "@/lib/s3-upload";
import { FileInputChangeEvent } from "@/lib/types";
import { AxiosError } from "axios";
import { ChevronRight, CirclePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export default function AddOrganisation() {
  const [, setLogo] = useState<File>();
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const organisationSchema = z.object({
    nom_entreprise: z.string().min(1, "Le nom de l'entreprise est requis"),
    secteur_activite: z.string().min(1, "Le secteur d'activité est requis"),
    taille: z.string().min(1, "La taille est requise"),
    adresse_siege: z.string().min(1, "L'adresse est requise"),
    code_postal: z
      .string()
      .length(5, "Le code postal doit contenir 5 chiffres"),
    ville: z.string().min(1, "La ville est requise"),
  });

  const handleFileInputChange = async (
    e: FileInputChangeEvent
  ): Promise<void> => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setLogo(files[0]);
      try {
        const urls = await uploadToS3([files[0]]);
        setLogoUrl(urls[0]);
        toast.success("Logo chargé avec succès");
      } catch (error) {
        toast.error(
          "Nous n'avons pas réussi à charger votre logo. Veuillez réessayer."
        );
        console.error(error);
      }
    }
  };

  return (
    <form
      className="flex flex-col gap-5 px-20 py-4 w-[762px]"
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
          organisationSchema.parse({
            nom_entreprise: formData.get("nom"),
            secteur_activite: formData.get("secteur_activite"),
            taille: formData.get("taille"),
            adresse_siege: formData.get("adresse_siege"),
            code_postal: formData.get("code_postal"),
            ville: formData.get("ville"),
          });

          if (!logoUrl) {
            toast.error("Erreur", {
              description: "Veuillez ajouter un logo d'entreprise",
            });
            return;
          }

          const organizationData = {
            nom: formData.get("nom") as string,
            nom_entreprise: formData.get("nom") as string,
            secteur_activite: formData.get("secteur_activite") as string,
            taille: formData.get("taille") as string,
            adresse_siege: formData.get("adresse_siege") as string,
            code_postal: formData.get("code_postal") as string,
            ville: formData.get("ville") as string,
            logo: logoUrl, // Use the S3 URL instead of the File object
            membre_ids: [1],
            description: "",
          };
          console.log("there", organizationData);
          await createOrganization(organizationData);

          toast.success(`L'organisation a été créée avec succès` );
          window.location.reload();
        } catch (error) {
          if (error instanceof z.ZodError) {
            const newErrors: Record<string, string> = {};
            error.errors.forEach((err) => {
              if (err.path) {
                newErrors[err.path[0]] = err.message;
              }
            });
            setErrors(newErrors);
            toast.error("Erreur de validation", {
              description: "Veuillez corriger les erreurs dans le formulaire",
            });
          }
          if (error instanceof AxiosError) {
            toast.error("Erreur lors de la création de l'organisation", {
              description: error?.response?.data.detail,
            });
            throw error;
          }
        }
      }}
    >
      <div className="flex flex-col gap-3">
        <Label htmlFor="nom_entreprise">Nom de l&apos;entreprise</Label>
        <Input id="nom_entreprise" name="nom" className="h-[36px]" />
        {errors.nom_entreprise && (
          <span className="text-red-500 text-xs">{errors.nom_entreprise}</span>
        )}
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-3 w-[48%]">
          <Label htmlFor="secteur_activite">Secteur d&apos;activité</Label>
          <Input
            id="secteur_activite"
            name="secteur_activite"
            className="h-[36px]"
          />
          {errors.secteur_activite && (
            <span className="text-red-500 text-xs">
              {errors.secteur_activite}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-3 w-[48%]">
          <Label htmlFor="taille">Taille</Label>
          <Select name="taille">
            <SelectTrigger className="w-full h-full">
              <SelectValue placeholder="Choisissez la taille" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel></SelectLabel>
                <SelectItem value="1-10">1-10</SelectItem>
                <SelectItem value="11-50">11-50</SelectItem>
                <SelectItem value="51-200">51-200</SelectItem>
                <SelectItem value="201-1000">201-1000</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.taille && (
            <span className="text-red-500 text-xs">{errors.taille}</span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="adresse_siege">Addresse du siège</Label>
        <Input
          id="adresse_siege"
          name="adresse_siege"
          type="text"
          className="h-[36px]"
        />
        {errors.adresse_siege && (
          <span className="text-red-500 text-xs">{errors.adresse_siege}</span>
        )}
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-3 w-[48%]">
          <Label htmlFor="code_postal">Code postal</Label>
          <Input id="code_postal" name="code_postal" className="h-[36px]" />
          {errors.code_postal && (
            <span className="text-red-500 text-xs">{errors.code_postal}</span>
          )}
        </div>
        <div className="flex flex-col gap-3 w-[48%]">
          <Label htmlFor="ville">Ville</Label>
          <Input id="ville" name="ville" className="h-[36px]" />
          {errors.ville && (
            <span className="text-red-500 text-xs">{errors.ville}</span>
          )}
        </div>
      </div>
      <div>
        <label className="font-medium text-white-800 text-xs">
          Logo de l&apos;entreprise
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
        className="self-end bg-gradient-to-r from-[#FE6539] to-crimson-400"
      >
        Enregistrer <ChevronRight />
      </Button>
    </form>
  );
}
