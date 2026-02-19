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
import { Input } from "@/components/ui/input";
import { getUser, updateProfile, User } from "@/lib/api/users";
import { uploadToS3 } from "@/lib/s3-upload";
import { getCookies } from "@/lib/utils/cookies";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z
    .string()
    .email("Adresse email invalide")
    .optional()
    .or(z.literal("")), // Allow empty string
  telephone: z.string().optional().or(z.literal("")), // Allow empty string
  image: z.any().optional(), // Allow file or string
});

export function ProfileForm() {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileBlob, setFileBlob] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      telephone: "",
      image: undefined,
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser();
        setUserInfo(user);
        if (user.image) {
          setImagePreview(user.image);
        }
        form.reset({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          telephone: user.telephone || "",
          image: user.image,
        });
      } catch (error) {
console.error(error)
        ;
        toast.error(
          "Erreur lors de la récupération des informations utilisateur."
        );
      }
    };
    fetchUser();
  }, [form]);

  const user: User = JSON.parse(getCookies("userInfo") || "{}");
  ;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      let imageUrl = userInfo?.image;

      if (fileBlob) {
        try {
          const res = await uploadToS3([fileBlob]);
          imageUrl = res[0];
          toast.success("Photo de profil téléchargée avec succès.");
        } catch (error) {
console.error(error)
          ;
          toast.error("Échec du téléchargement de la photo.");
          setIsSubmitting(false);
          return;
        }
      }

      const data: Partial<User> = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        telephone: values.telephone,
        image: imageUrl,
      };

      const hasChanged = Object.keys(data).some(
        (key) =>
          data[key as keyof typeof data] !==
          userInfo?.[key as keyof typeof userInfo]
      );

      if (hasChanged) {
        const res = await updateProfile(data);
        document.cookie = `userInfo=${JSON.stringify(res.user)};path=/`;
        toast.success("Profil mis à jour avec succès.");
        window.location.reload();
      } else {
        toast.info("Aucune modification à enregistrer.");
      }
    } catch (error) {
console.error(error)
      toast.error("Échec de la mise à jour du profil.");
      ;
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
                <Input placeholder="Prénom" {...field} />
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
                <Input placeholder="Nom" {...field} />
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
                <Input placeholder="Email" type="email" {...field} />
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
                <Input placeholder="Téléphone" type="tel" {...field} />
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
              <FormLabel>Photo de profil</FormLabel>
              <div className="flex items-center gap-4">
                <Image
                  src={imagePreview || "/user-icon.svg"}
                  alt="Aperçu de la photo de profil"
                  width={80}
                  height={80}
                  className="rounded-full object-cover w-20 h-20 border"
                />
                <FormControl>
                  <>
                    <Input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFileBlob(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const dataUrl = reader.result as string;
                            setImagePreview(dataUrl);
                          };
                          reader.readAsDataURL(file);
                          field.onChange(file);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Changer la photo
                    </Button>
                  </>
                </FormControl>
              </div>
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
