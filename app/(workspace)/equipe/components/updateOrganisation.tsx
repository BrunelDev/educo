import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    getOrganization,
    OrganizationResponse,
    updateOrganisation,
} from "@/lib/api/organisation";
import { uploadToS3 } from "@/lib/s3-upload";
import { FileInputChangeEvent } from "@/lib/types";
import { AxiosError } from "axios";
import { ChevronRight, CirclePlus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const institutionTypes = [
  "Université publique",
  "Université privée",
  "Grande École",
  "Institut de recherche",
  "Lycée technique",
  "Centre de formation",
  "Autre établissement d'enseignement",
] as const;

export default function UpdateOrganisationForm({
  orgId,
  handleClose,
}: {
  orgId: number;
  handleClose: () => void;
}) {
  const [, setLogo] = useState<File>();
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [organization, setOrganization] = useState<OrganizationResponse | null>(
    null
  );

  const organisationSchema = z.object({
    nom_entreprise: z
      .string()
      .min(1, "Le nom de l'établissement est requis")
      .optional(),
    secteur_activite: z
      .string()
      .min(1, "Le secteur d'activité est requis")
      .optional(),
    taille: z
      .string()
      .regex(/^[1-9]\d*$/, "La taille doit être un nombre entier positif")
      .min(1, "La taille est requise")
      .optional(),
    adresse_siege: z.string().min(1, "L'adresse est requise").optional(),
    code_postal: z
      .string()
      .length(5, "Le code postal doit contenir 5 chiffres")
      .optional(),
    ville: z.string().min(1, "La ville est requise").optional(),
    annee_election: z
      .string()
      .regex(
        /^\d{4}$/,
        "La dernière année d'élection doit être valide (ex: 2024)"
      )
      .optional(),
    convention_collective: z
      .string()
      .min(1, "La convention collective est requise")
      .optional(),
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
        toast.success("Le logo a été chargé avec succès");
      } catch (error) {
console.error(error)
        toast.error("Nous n'avons pas réussi à charger votre logo.");
        throw error;
        //;
      }
    }
  };

  useEffect(() => {
    const fun = async () => {
      try {
        const response = await getOrganization();
        if (response) {
          setOrganization(response);
          setLogoUrl(response.organisation.logo || "");
        }
      } catch (error) {
console.error(error)
        ;
      }
    };
    fun();
  }, [orgId]);

  return (
    <ScrollArea className="h-[calc(100vh-10rem)] w-full">
      <form
        className="flex flex-col gap-5 px-4 sm:px-8 md:px-12 lg:px-16 py-4 w-full max-w-3xl mx-auto"
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
              convention_collective:
                formData.get("convention_collective") || undefined,
              membres_cse_invites:
                formData.get("membres_cse_invites") || undefined,
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

            const conventionCollective = formData.get(
              "convention_collective"
            ) as string;
            if (conventionCollective)
              organizationData.collective = conventionCollective;

            const membresInvites = formData.get(
              "membres_cse_invites"
            ) as string;
            if (formData.has("membres_cse_invites")) {
              if (membresInvites && membresInvites.trim() !== "") {
                organizationData.invites = membresInvites
                  .split(",")
                  .map((email) => email.trim())
                  .filter((email) => email);
              } else {
                organizationData.invites = [];
              }
            }

            if (logoUrl) organizationData.logo = logoUrl;
            // The description field is not explicitly handled here as it's not part of the added fields.
            // If it needs to be updated or cleared, specific logic would be required.

            ;
            await updateOrganisation(orgId, organizationData);

            toast.success(`L'établissement a été modifié avec succès`);
            handleClose();
          } catch (error) {
console.error(error)
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
              toast.error("Erreur lors de la modification de l'établissement", {
                description: error?.response?.data.detail,
              });
              throw error;
            }
          }
        }}
      >
        <div className="flex flex-col gap-3">
          <Label htmlFor="nom_entreprise">Nom de l&apos;établissement</Label>
          <Input
            defaultValue={organization?.organisation.nom_entreprise}
            id="nom_entreprise"
            name="nom_entreprise"
            className="h-[36px]"
          />
          {errors.nom_entreprise && (
            <span className="text-red-500 text-xs">
              {errors.nom_entreprise}
            </span>
          )}
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-5">
          <div className="flex flex-col gap-3 w-full sm:w-[48%]">
            <Label htmlFor="secteur_activite">Type d&apos;établissement</Label>
            <Select
              name="secteur_activite"
              defaultValue={organization?.organisation.secteur_activite}
            >
              <SelectTrigger className="h-[36px]">
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                {institutionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.secteur_activite && (
              <span className="text-red-500 text-xs">
                {errors.secteur_activite}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 w-full sm:w-[48%]">
            <Label htmlFor="taille">Effectif du personnel</Label>
            <Input
              defaultValue={organization?.organisation.taille}
              type="number"
              id="taille"
              name="taille"
              className="h-[36px]"
              placeholder="Entrez le nombre d'enseignants"
            />
            {errors.taille && (
              <span className="text-red-500 text-xs">{errors.taille}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="adresse_siege">Adresse du campus</Label>
          <Input
            defaultValue={organization?.organisation.adresse_siege}
            id="adresse_siege"
            name="adresse_siege"
            type="text"
            className="h-[36px]"
          />
          {errors.adresse_siege && (
            <span className="text-red-500 text-xs">{errors.adresse_siege}</span>
          )}
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-5">
          <div className="flex flex-col gap-3 w-full sm:w-[48%]">
            <Label htmlFor="code_postal">Code postal</Label>
            <Input
              id="code_postal"
              name="code_postal"
              className="h-[36px]"
              defaultValue={organization?.organisation.code_postal}
            />
            {errors.code_postal && (
              <span className="text-red-500 text-xs">{errors.code_postal}</span>
            )}
          </div>
          <div className="flex flex-col gap-3 w-full sm:w-[48%]">
            <Label htmlFor="ville">Ville</Label>
            <Input
              id="ville"
              name="ville"
              className="h-[36px]"
              defaultValue={organization?.organisation.ville}
            />
            {errors.ville && (
              <span className="text-red-500 text-xs">{errors.ville}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="annee_election">Année académique de référence</Label>
          <Input
            id="annee_election"
            name="annee_election"
            type="number"
            placeholder="YYYY"
            className="h-[36px]"
            defaultValue={organization?.organisation.annee_election}
          />
          {errors.annee_election && (
            <span className="text-red-500 text-xs">
              {errors.annee_election}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="convention_collective">Département</Label>
          <Input
            id="convention_collective"
            name="convention_collective"
            className="h-[36px]"
            placeholder="Entrez le nom du département"
            defaultValue={organization?.organisation.collective || ""}
          />
          {errors.convention_collective && (
            <span className="text-red-500 text-xs">
              {errors.convention_collective}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="membres_cse_invites">
            Invitez le personnel académique (emails séparés par virgule)
          </Label>
          <Input
            id="membres_cse_invites"
            name="membres_cse_invites"
            placeholder="membre1@email.com, membre2@email.com"
            className="h-[36px]"
          />
          {errors.membres_cse_invites && (
            <span className="text-red-500 text-xs">
              {errors.membres_cse_invites}
            </span>
          )}
        </div>
        <div>
          <label className="font-medium text-white-800 text-xs">
            Logo de l&apos;établissement
          </label>
          <div
            className={`relative rounded-[8px] overflow-hidden border border-dashed border-white-300 w-full h-[136px] ${
              logoUrl ? "border-none" : ""
            } flex justify-center items-center`}
          >
            {logoUrl ? (
              <div className="relative w-full h-full">
                <Image
                  src={logoUrl}
                  alt="Aperçu du logo"
                  layout="fill"
                  objectFit="contain"
                  style={{ width: "100%" }}
                  className="rounded-[8px]"
                />
                <div className="absolute top-1 right-1 z-20 bg-white rounded-full p-1">
                  <X
                    onClick={(e) => {
                      e.preventDefault();
                      setLogoUrl("");
                      const input = document.getElementById(
                        "logoInputAddOrgAfterLogin"
                      ) as HTMLInputElement;
                      if (input) input.value = "";
                    }}
                    className="cursor-pointer h-4 w-4 text-gray-600 hover:text-black"
                  />
                </div>
              </div>
            ) : (
              <>
                <Input
                  name="logo"
                  id="logoInputAddOrgAfterLogin"
                  onChange={handleFileInputChange}
                  type="file"
                  accept="image/*"
                  className="w-full h-full cursor-pointer opacity-0 absolute top-0 left-0 z-10"
                />
                <Label
                  htmlFor="logoInputAddOrgAfterLogin"
                  className="w-full h-full flex flex-col gap-2 justify-center items-center cursor-pointer text-center"
                >
                  <CirclePlus />
                  <h6>
                    Glissez et déposez ou cliquez ici pour choisir un fichier
                  </h6>
                  <div className="text-xs">Taille maximale 10MB</div>
                </Label>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
          <Button
            type="submit"
            className="bg-gradient-to-r from-[#FE6539] to-crimson-400 w-full sm:w-auto flex items-center gap-2"
          >
            <h6>Enregistrer les modifications</h6>
            <ChevronRight />
          </Button>
        </div>
      </form>
    </ScrollArea>
  );
}
