"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getOrganization, OrganizationResponse } from "@/lib/api/organisation";
import { login } from "@/lib/functions";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"; // Removed useEffect as it's no longer used here
import { toast } from "sonner";
import { AddOrganisationAfterLogin } from "../(workspace)/equipe/components/addOrganisation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddOrgDialog, setShowAddOrgDialog] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (!email) {
      toast.error("L'adresse e-mail est requise");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("L'adresse e-mail n'est pas valide");
      return false;
    }
    if (!password) {
      toast.error("Le mot de passe est requis");
      return false;
    }
    if (password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return false;
    }
    return true;
  };

  const handleOrgDialogComplete = () => {
    setShowAddOrgDialog(false);
    router.push("/dashboard");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const loginResponse = await login(email, password);
      if (loginResponse) {
        toast.success("Connexion réussie");
        router.refresh(); // Refresh session/cookies

        // Check for organization after login
        try {
          const orgData: OrganizationResponse | null = await getOrganization();
          if (!orgData?.organisation) {
            setShowAddOrgDialog(true); // Show dialog if no organization
          } else {
            router.push("/dashboard");
          }
        } catch (orgError) {
          ;
          setShowAddOrgDialog(true);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        // Assuming login function throws error with a message for incorrect credentials
        toast.error(err.message || "Mot de passe ou email incorrect");
      } else {
        toast.error("Une erreur est survenue lors de la connexion");
      }
      ;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        className="flex flex-col gap-6 w-full"
        method="post"
        onSubmit={async (e) => await handleSubmit(e)}
      >
        <div className="gap-2 w-full">
          <h1 className="text-2xl font-bold">Connectez vous</h1>
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
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Mot de passe</Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <a
              href="/motDePasseOublie"
              className="ml-auto text-sm text-coral-500 font-medium underline-offset-4 hover:underline"
            >
              Mot de passe oublié ?
            </a>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer h-11 bg-gradient-to-r from-[#FE6539] to-crimson-400 w-full"
          >
            {isLoading ? (
              <div className="flex items-center gap-2 justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Connexion en cours...
              </div>
            ) : (
              "Se connecter"
            )}
          </Button>
        </div>
        <div className="text-center text-sm">
          Vous n’avez pas de compte ?{" "}
          <Link
            href="/register"
            className="text-coral-500 font-medium underline-offset-4 hover:underline"
          >
            S&apos;inscrire
          </Link>
        </div>
      </form>

      <Dialog open={showAddOrgDialog} onOpenChange={setShowAddOrgDialog}>
        <DialogContent className="sm:max-w-[768px]">
          <DialogHeader>
            <DialogTitle>Ajouter votre établissement</DialogTitle>
            <DialogDescription>
              Pour accéder à toutes les fonctionnalités, veuillez enregistrer
              les informations de votre établissement.
            </DialogDescription>
          </DialogHeader>
          <AddOrganisationAfterLogin onComplete={handleOrgDialogComplete} />
        </DialogContent>
      </Dialog>
    </>
  );
}
