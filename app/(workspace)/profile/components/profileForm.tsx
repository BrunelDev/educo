"use client";
import Image from "next/image";
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
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email("Adresse email invalide").optional().or(z.literal('')), // Allow empty string
  telephone: z.string().optional().or(z.literal('')), // Allow empty string
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
  const [imagePreview, setImagePreview] = useState<string | null>(userInfo.image || null);

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
            // Add fields to data if they are provided and different from initial values, or if it's the image
      if (values.first_name !== undefined) data.first_name = values.first_name;
      if (values.last_name !== undefined) data.last_name = values.last_name;
      if (values.email !== undefined) data.email = values.email;
      if (values.telephone !== undefined) data.telephone = values.telephone;
      // Image is handled separately with fileBlob

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
                    if (file) {
                      setFileBlob(file); // Keep the file object for actual upload
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const dataUrl = reader.result as string;
                        setImagePreview(dataUrl);
                        // field.onChange(dataUrl); // Option 1: Update form with Data URL
                                                // Option 2: Keep original field.onChange for file object if backend expects file
                                                // For now, let's assume the form's 'image' field is for the final URL after upload,
                                                // so we won't call field.onChange here with the dataUrl.
                                                // The actual image string for the form will be set on successful S3 upload.
                      };
                      reader.readAsDataURL(file);
                    } else {
                      setImagePreview(userInfo.image || null);
                      setFileBlob(undefined);
                      field.onChange(userInfo.image || ""); // Reset form field if selection is cleared
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
              {/* Image Preview Code Starts Here */}
              {imagePreview && (
                <div className="mt-4 w-32 h-32 rounded-full overflow-hidden mx-auto border-2 border-gray-300 shadow-md">
                  {imagePreview.startsWith('data:image') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imagePreview} alt="Aperçu de l'image" className="w-full h-full object-cover" />
                  ) : (
                    <Image src={imagePreview} alt="Aperçu de l'image" width={128} height={128} className="w-full h-full object-cover" />
                  )}
                </div>
              )}
              {!imagePreview && userInfo.image && (
                 <div className="mt-4 w-32 h-32 rounded-full overflow-hidden mx-auto border-2 border-gray-300 shadow-md">
                  <Image src={userInfo.image} alt="Photo de profil actuelle" width={128} height={128} className="w-full h-full object-cover" />
                </div>
              )}
               {!imagePreview && !userInfo.image && (
                 <div className="mt-4 w-32 h-32 rounded-full overflow-hidden mx-auto border-2 border-gray-200 bg-gray-100 flex items-center justify-center shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              {/* Image Preview Code Ends Here */}
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
