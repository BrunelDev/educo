"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getOrganisationMembers, OrganizationMember } from "@/lib/api/organisation";
import { createGroup } from "@/lib/api/messagerie";
import { toast } from "sonner";
import Image from "next/image";

interface CreateGroupFormProps {
  onGroupCreated: () => void;
  currentUserId: number; // Or string, depending on your user ID type
}

const formSchema = z.object({
  nom: z.string().min(1, { message: "Le nom du groupe est requis." }),
  description: z.string().optional(),
  selectedMemberIds: z.array(z.number()).min(1, { message: "Veuillez sélectionner au moins un membre." }),
});

export default function CreateGroupForm({ onGroupCreated, currentUserId }: CreateGroupFormProps) {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMembers, setIsFetchingMembers] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      description: "",
      selectedMemberIds: [],
    },
  });

  useEffect(() => {
    const fetchMembers = async () => {
      setIsFetchingMembers(true);
      try {
        const response = await getOrganisationMembers();
        // Filter out the current user
        setMembers(response.filter(member => member.id !== currentUserId));
      } catch (error) {
        console.error("Error fetching organization members:", error);
        toast.error("Erreur lors de la récupération des membres de l'organisation");
      } finally {
        setIsFetchingMembers(false);
      }
    };

    fetchMembers();
  }, [currentUserId]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const payload = {
        nom: values.nom,
        description: values.description || undefined, // Send undefined if empty, so API can use default or ignore
        membres: values.selectedMemberIds,
      };
      const newGroup = await createGroup(payload);
      toast.success(`Groupe "${newGroup.nom}" créé avec succès !`);
      onGroupCreated(); // Close the dialog and potentially refresh group list
      form.reset(); 
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error(error instanceof Error ? error.message : "Échec de la création du groupe.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="nom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du groupe</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Équipe Marketing" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optionnel)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Ex: Discussions sur les campagnes à venir" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <FormField
          control={form.control}
          name="selectedMemberIds"
          render={() => (
            <FormItem>
              <FormLabel>Membres de l&apos;équipe</FormLabel>
              <FormControl>
                <ScrollArea className="h-[250px] border rounded-md p-2">
                  {isFetchingMembers ? (
                    <p className="text-center text-gray-500">Chargement des membres...</p>
                  ) : members.length > 0 ? (
                    members.map((member) => (
                      <FormField
                        key={member.id}
                        control={form.control}
                        name="selectedMemberIds"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={member.id}
                              className="flex flex-row items-center space-x-3 space-y-0 py-2 px-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(member.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), member.id])
                                      : field.onChange(
                                          (field.value || []).filter(
                                            (value) => value !== member.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <div className="flex items-center gap-2 cursor-pointer flex-grow" onClick={() => {
                                const isChecked = field.value?.includes(member.id);
                                if (isChecked) {
                                  field.onChange((field.value || []).filter(value => value !== member.id));
                                } else {
                                  field.onChange([...(field.value || []), member.id]);
                                }
                              }}>
                                <div className="h-[28px] w-[28px] flex items-center justify-center border border-dashed rounded-full overflow-hidden flex-shrink-0">
                                  {member.image ? (
                                    <Image
                                      src={member.image}
                                      width={28}
                                      height={28}
                                      alt={`${member.first_name} ${member.last_name}`}
                                      className="object-cover"
                                    />
                                  ) : (
                                    <Image
                                      src="/user-icon.svg"
                                      width={16}
                                      height={19}
                                      alt="user icon"
                                    />
                                  )}
                                </div>
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  {member.first_name} {member.last_name} ({member.email})
                                </FormLabel>
                              </div>
                            </FormItem>
                          );
                        }}
                      />
                    ))
                  ) : (
                    <p className="text-center text-gray-500">Aucun autre membre trouvé.</p>
                  )}
                </ScrollArea>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading || isFetchingMembers}>
          {isLoading ? "Création du groupe..." : "Confirmer et Créer le Groupe"}
        </Button>
      </form>
    </Form>
  );
}
