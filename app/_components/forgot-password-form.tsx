"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "@/lib/api/users";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!email) {
      toast.error("L'adresse e-mail est requise");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("L'adresse e-mail n'est pas valide");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate API call
    try {
      const response = await requestPasswordReset(email);
      console.log(response);
      setIsLoading(false);
      toast.success("Un lien de réinitialisation a été envoyé à votre adresse e-mail");
    } catch (error) {
      setIsLoading(false);
      console.error("Error requesting password reset", error);
      toast.error("Veuillez vérifier votre adresse e-mail et réessayez");
    }
    setEmail(""); // Clear the input field
  };

  return (
    <form
      className="flex flex-col gap-6 w-full"
      method="post"
      onSubmit={handleSubmit}
    >
      <div className="gap-2 w-full">
        <h1 className="text-2xl font-bold">Mot de passe oublié ?</h1>
        <p className="text-sm text-gray-600">
          Entrez votre adresse e-mail ci-dessous et nous vous enverrons les instructions pour réinitialiser votre mot de passe.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer h-11 bg-gradient-to-r from-[#FE6539] to-crimson-400 w-full"
        >
          {isLoading ? (
            <div className="flex items-center gap-2 justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Envoi en cours...
            </div>
          ) : (
            "Envoyer le lien de réinitialisation"
          )}
        </Button>
      </div>
      <div className="text-center text-sm">
        <Link
          href="/login"
          className="text-coral-500 font-medium underline-offset-4 hover:underline"
        >
          Retour à la connexion
        </Link>
      </div>
    </form>
  );
}
