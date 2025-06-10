import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { updateOrganisation } from "@/lib/api/organisation";
import { uploadToS3 } from "@/lib/s3-upload";
import { FileInputChangeEvent } from "@/lib/types";
import { AxiosError } from "axios";
import { ChevronRight, CirclePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function UpdateOrganisationForm({ orgId, handleClose }: { orgId: number; handleClose: () => void }) {
  const [, setLogo] = useState<File>();
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const organisationSchema = z.object({
    nom_entreprise: z
      .string()
      .min(1, "Le nom de l'entreprise est requis")
      .optional(),
    secteur_activite: z
      .string()
      .min(1, "Le secteur d'activité est requis")
      .optional(),
    taille: z.string().regex(/^[1-9]\d*$/, "La taille doit être un nombre entier positif").min(1, "La taille est requise").optional(),
    adresse_siege: z.string().min(1, "L'adresse est requise").optional(),
    code_postal: z
      .string()
      .length(5, "Le code postal doit contenir 5 chiffres")
      .optional(),
    ville: z.string().min(1, "La ville est requise").optional(),
    annee_election: z.string().regex(/^\d{4}$/, "L'année d'élection doit être valide (ex: 2024)").optional(),
    convention_collective: z.string().min(1, "La convention collective est requise").optional(),
    membres_cse_invites: z.string().optional(),
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
        toast.success("Logo uploaded successfully");
      } catch (error) {
        toast.error("Failed to upload logo");
        console.error(error);
      }
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-10rem)] w-full">

    <form
      className="flex flex-col gap-5 px-20 py-4 w-[762px]"
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
          organisationSchema.parse({
            nom_entreprise: formData.get("nom_entreprise") || undefined,
            secteur_activite: formData.get("secteur_activite") || undefined,
            taille: formData.get("taille") || undefined,
            adresse_siege: formData.get("adresse_siege") || undefined,
            code_postal: formData.get("code_postal") || undefined,
            ville: formData.get("ville") || undefined,
            annee_election: formData.get("annee_election") || undefined,
            convention_collective: formData.get("convention_collective") || undefined,
            membres_cse_invites: formData.get("membres_cse_invites") || undefined,
          });

          const organizationData: Partial<{
            nom: string;
            nom_entreprise: string;
            secteur_activite: string;
            taille: string;
            adresse_siege: string;
            code_postal: string;
            ville: string;
            annee_election: string;
            collective: string; 
            invites: string[];
            logo: string;
            description: string;
          }> = {};

          const nomEntreprise = formData.get("nom_entreprise") as string; 
          if (nomEntreprise) {
            organizationData.nom = nomEntreprise;
            organizationData.nom_entreprise = nomEntreprise;
          }

          const secteur = formData.get("secteur_activite") as string;
          if (secteur) organizationData.secteur_activite = secteur;

          const tailleValue = formData.get("taille") as string; 
          if (tailleValue) organizationData.taille = tailleValue;

          const adresse = formData.get("adresse_siege") as string;
          if (adresse) organizationData.adresse_siege = adresse;

          const codePostalValue = formData.get("code_postal") as string;
          if (codePostalValue) organizationData.code_postal = codePostalValue;

          const villeValue = formData.get("ville") as string; 
          if (villeValue) organizationData.ville = villeValue;

          const anneeElection = formData.get("annee_election") as string;
          if (anneeElection) organizationData.annee_election = anneeElection;

          const conventionCollective = formData.get("convention_collective") as string;
          if (conventionCollective) organizationData.collective = conventionCollective;

          const membresInvites = formData.get("membres_cse_invites") as string;
          if (formData.has("membres_cse_invites")) { 
            if (membresInvites && membresInvites.trim() !== "") {
              organizationData.invites = membresInvites.split(',').map(email => email.trim()).filter(email => email);
            } else {
              organizationData.invites = [];
            }
          }

          if (logoUrl) organizationData.logo = logoUrl;
          // The description field is not explicitly handled here as it's not part of the added fields.
          // If it needs to be updated or cleared, specific logic would be required.

          console.log("Submitting:", organizationData);
          await updateOrganisation(orgId, organizationData);

          toast.success(`L'organisation a été modifiée avec succès`);
          handleClose();
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
            toast.error("Erreur lors de la modification de l'organisation", {
              description: error?.response?.data.detail,
            });
            throw error;
          }
        }
      }}
    >
      <div className="flex flex-col gap-3">
        <Label htmlFor="nom_entreprise">Nom de l&apos;entreprise</Label>
        <Input id="nom_entreprise" name="nom_entreprise" className="h-[36px]" />
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
          <Label htmlFor="taille">Nombre de salariés</Label>
          <Input
            type="number"
            id="taille"
            name="taille"
            className="h-[36px]"
            placeholder="Entrez le nombre de salariés"
          />
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
      {/* Année d’élection */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="annee_election">Année d’élection</Label>
        <Input id="annee_election" name="annee_election" type="number" placeholder="YYYY" className="h-[36px]" />
        {errors.annee_election && (
          <span className="text-red-500 text-xs">{errors.annee_election}</span>
        )}
      </div>

      {/* Convention collective */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="convention_collective">Convention collective</Label>
        <Input
          id="convention_collective"
          name="convention_collective"
          className="h-[36px]"
          placeholder="Entrez la convention collective"
        />
        {errors.convention_collective && (
          <span className="text-red-500 text-xs">{errors.convention_collective}</span>
        )}
      </div>

      {/* Invitez les membres CSE */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="membres_cse_invites">Invitez les membres CSE (emails séparés par virgule)</Label>
        <Input id="membres_cse_invites" name="membres_cse_invites" placeholder="membre1@email.com, membre2@email.com" className="h-[36px]" />
        {errors.membres_cse_invites && (
          <span className="text-red-500 text-xs">{errors.membres_cse_invites}</span>
        )}
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
    </ScrollArea>
  );
}
