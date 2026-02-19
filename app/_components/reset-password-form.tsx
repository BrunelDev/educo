"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { confirmPasswordReset } from "@/lib/api/users";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Uncomment if navigation is needed after reset
import { useState } from "react";
import { toast } from "sonner";

export function ResetPasswordForm({
  uid,
  token,
}: {
  uid: string;
  token: string;
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Uncomment if navigation is needed

  const validateForm = () => {
    if (!password) {
      toast.error("Le nouveau mot de passe est requis");
      return false;
    }
    if (password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return false;
    }
    if (!confirmPassword) {
      toast.error("La confirmation du mot de passe est requise");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Le mot de passe doit contenir au moins une majuscule");
      return false;
    }
    if (!/[a-z]/.test(password)) {
      toast.error("Le mot de passe doit contenir au moins une minuscule");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      toast.error("Le mot de passe doit contenir au moins un chiffre");
      return false;
    }
    if (!/[!@#$%-_^&*]/.test(password)) {
      toast.error(
        "Le mot de passe doit contenir au moins un caractère spécial"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await confirmPasswordReset(uid, token, password);
      ;
      setIsLoading(false);
      toast.success(response.message);
      setPassword("");
      setConfirmPassword("");
      router.push("/login");
    } catch (error) {
console.error(error)
      setIsLoading(false);
      ;
      toast.error("Veuillez vérifier votre adresse e-mail et réessayez");
    }
  };

  return (
    <form
      className="flex flex-col gap-6 w-full"
      method="post"
      onSubmit={handleSubmit}
    >
      <div className="gap-2 w-full">
        <h1 className="text-2xl font-bold">Réinitialiser le mot de passe</h1>
        <p className="text-sm text-gray-600">
          Veuillez choisir un nouveau mot de passe sécurisé.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="password">Nouveau mot de passe</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
              placeholder="********"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">
            Confirmer le nouveau mot de passe
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pr-10"
              placeholder="********"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer bg-gradient-to-r from-[#FE6539] to-crimson-400 w-full"
        >
          {isLoading ? (
            <div className="flex items-center gap-2 justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Réinitialisation en cours...
            </div>
          ) : (
            "Réinitialiser le mot de passe"
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
