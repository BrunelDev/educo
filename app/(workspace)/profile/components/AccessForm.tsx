"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getOrganisationMembers,
  OrganizationMember,
} from "@/lib/api/organisation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { grantAccess } from "@/lib/api/equipe";

const accessRoles = [
  "Responsable des documents",
  "Responsable de l'IA",
  "Responsable des réunions",
] as const;

const formSchema = z.object({
  memberEmail: z.string().min(1, { message: "Veuillez sélectionner un membre." }),
  role: z.string().min(1, { message: "Veuillez sélectionner un rôle pour le membre choisi." }),
});

export function AccessForm() {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [memberRoles, setMemberRoles] = useState<{
    [memberEmail: string]: string;
  }>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      memberEmail: "",
      role: "",
    },
  });

  const { formState: { errors } } = form;

  // Fetch organization members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await getOrganisationMembers();
        setMembers(response);
      } catch (error) {
        console.error("Error fetching organization members:", error);
        toast.error(
          "Erreur lors de la récupération des membres de l'organisation"
        );
      }
    };

    fetchMembers();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Here you would implement the API call to update access
      console.log(
        "Selected member email:",
        values.memberEmail,
        "Selected Role:",
        values.role
      );
      const role = values.role === "Responsable des documents" ? {"peut_modifier_fichier": true} : values.role === "Responsable de l'IA" ? {"peut_utiliser_ia" : true} : values.role === "Responsable des réunions" ? {"peut_creer_reunion": true}  : null;
      await grantAccess(values.memberEmail, role);

      // Mock API call success
      toast.success("Accès mis à jour avec succès");

      
    } catch (error) {
      toast.error("Échec de la mise à jour des accès");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleRoleChange = (memberEmail: string, newRole: string) => {
    setMemberRoles((prevRoles) => ({ ...prevRoles, [memberEmail]: newRole }));
    // When a role is selected for a member, that member and role become the active selection for the form.
    form.setValue("memberEmail", memberEmail, { shouldValidate: true });
    form.setValue("role", newRole, { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="memberEmail"
          render={() => (
            <FormItem>
              <FormLabel>Sélectionner un membre et assigner un rôle</FormLabel>
              <FormControl>
                <ScrollArea className="h-[200px] border rounded-md p-2">
                  {members.length > 0 ? (
                    members.map((member) => (
                      <div
                        key={member.id}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 px-1 gap-2"
                      >
                        <div className="flex gap-3 items-center flex-grow w-full sm:w-auto">
                          <div className="h-[28px] w-[28px] flex items-center justify-center border border-dashed rounded-full overflow-hidden flex-shrink-0">
                            {member.image ? (
                              <Image
                                src={member.image}
                                width={28}
                                height={28}
                                alt={`${member.first_name} ${member.last_name}`}
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
                          <span
                            className="text-sm truncate"
                            title={`${member.first_name} ${member.last_name} (${member.email})`}
                          >
                            {member.first_name} {member.last_name} (
                            {member.email})
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 w-full sm:w-auto">
                          <Select
                            value={memberRoles[member.email] || ""}
                            onValueChange={(newRole) =>
                              handleRoleChange(member.email, newRole)
                            }
                          >
                            <SelectTrigger className="w-full text-xs">
                              <SelectValue placeholder="Sélectionner un rôle" />
                            </SelectTrigger>
                            <SelectContent>
                              {accessRoles.map((role) => (
                                <SelectItem
                                  key={role}
                                  value={role}
                                  className="text-xs"
                                >
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-2 text-center text-gray-500">
                      Aucun membre trouvé
                    </div>
                  )}
                </ScrollArea>
              </FormControl>
              <FormMessage /> {/* Displays errors for memberEmail */}
            </FormItem>
          )}
        />
        {errors.role && (
          <p className="text-sm font-medium text-destructive">
            {errors.role.message}
          </p>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? "Mise à jour..." : "Mettre à jour les accès"}
        </Button>
      </form>
    </Form>
  );
}
