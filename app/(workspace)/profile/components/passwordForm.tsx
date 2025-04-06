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
import { updatePassword } from "@/lib/api/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  old_password: z.string().min(8, "Mot de passe trop court"),
  new_password: z.string().min(8, "Mot de passe trop court"),
  confirm_password: z.string().min(8,"Mot de passe trop court"),
});

export function PasswordForm() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: ""
    },
  });
    async function onSubmit(values: z.infer<typeof formSchema>) {
      // Validate password match before updating password
        if (values.new_password !== values.confirm_password) {
            toast.error("Les mots de passe ne correspondent pas");
            return;
    }
    console.log(values);
   const res = await updatePassword(values);
   // setCookie("userInfo", JSON.stringify(res.user));
    //console.log(res.message);
    toast( JSON.stringify(res))
    //console.log(res);
    // Handle form submission here
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="old_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ancien mot de passe</FormLabel>
              <FormControl>
                <Input  {...field} type="password"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nouveau mot de passe</FormLabel>
              <FormControl>
                <Input {...field} type="password"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmez votre mot de passe</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-coral-400 to-crimson-400"
        >
          Valider
        </Button>
      </form>
    </Form>
  );
}
