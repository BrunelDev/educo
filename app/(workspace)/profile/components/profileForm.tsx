"use client";
import { User } from "@/app/types/auth";
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
import { updateProfile } from "@/lib/api/users";
import { uploadToS3 } from "@/lib/s3-upload";
import { getCookies } from "@/lib/utils/cookies";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  first_name: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .optional(),
  last_name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .optional()
    .optional(),
  email: z.string().email("Adresse email invalide").optional(),
  telephone: z.string().min(8, "Le numéro doit contenir au moins 8 chiffres"),
  image: z.string().optional(),
});

export function ProfileForm() {
  const userInfo: User = JSON.parse(getCookies("userInfo") || "{}");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: userInfo.first_name,
      last_name: userInfo.last_name,
      email: userInfo.email,
      telephone: userInfo.telephone,
      image: userInfo.image || "",
    },
  });

  const [fileBlob, setFileBlob] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const data: Partial<z.infer<typeof formSchema>> = {};

      if (fileBlob) {
        try {
          const res = await uploadToS3([fileBlob]);
          data.image = res[0];
          toast.success("Photo de profil téléchargée avec succès");
        } catch (error: unknown) {
          toast.error("Échec du téléchargement de la photo");
          throw error;
        }
      }

      // Only add fields that have values
      if (values.first_name?.trim()) data.first_name = values.first_name;
      if (values.last_name?.trim()) data.last_name = values.last_name;
      if (values.email?.trim()) data.email = values.email;
      if (values.telephone?.trim()) data.telephone = values.telephone;

      // Only proceed if we have data to update
      if (Object.keys(data).length > 0) {
        const res = await updateProfile(data);
        document.cookie = `userInfo=${JSON.stringify(res.user)};path=/`
        toast.success("Profil mis à jour avec succès");
        window.location.reload();
      } else {
        toast.error("Aucune modification à enregistrer");
      }
    } catch (error) {
      toast.error("Échec de la mise à jour du profil");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="john.doe@example.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telephone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input placeholder="+229 97000000" type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo de profile</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setFileBlob(file);
                    if (file) {
                      field.onChange(URL.createObjectURL(file));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-coral-400 to-crimson-400"
        >
          {isSubmitting ? "Mise à jour..." : "Valider"}
        </Button>
      </form>
    </Form>
  );
}
