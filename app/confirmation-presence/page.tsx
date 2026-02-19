"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    confirmPresence,
    confirmPresenceExternalMember,
} from "@/lib/api/organisation";
import {
    CheckCircle2,
    CircleX,
    Mail,
    RefreshCw,
    UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Disponibilite = "PRESENT" | "ABSENT";

export default function ConfirmationPresence() {
  const searchParams = useSearchParams();

  const reunion_id = searchParams.get("reunion_id");
  const user_id = searchParams.get("user_id");
  const disponible = searchParams.get("disponible") as Disponibilite;
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  console.log({
    reunion_id,
    user_id,
    disponible,
    email,
    token,
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const handleConfirmPresence = useCallback(async () => {
    try {
      setErrorMsg(null);

      setStatus("loading");

      const payloadBase = {
        reunion_id: Number(reunion_id),
        disponible,
      } as const;

      if (email) {
        await confirmPresenceExternalMember({ ...payloadBase, email });
        router.push("/register");
      } else {
        await confirmPresence({
          ...payloadBase,
          user_id: Number(user_id),
          token: token!,
        });
        router.push("/reunions");
      }

      setStatus("success");
    } catch (error) {
console.error(error)
      ;
      setStatus("error");
      setErrorMsg(
        "Une erreur est survenue lors de la confirmation. Veuillez réessayer."
      );
    }
  }, [disponible, email, reunion_id, router, token, user_id]);

  useEffect(() => {
    // Open confirmation dialog on mount
    setConfirmOpen(true);
  }, []);

  const isPresent = disponible === "PRESENT";

  return (
    <div className="min-h-[80vh] w-full bg-gradient-to-br from-color-coral-50 via-white to-crimson-50 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl shadow-lg border-transparent">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Confirmation de présence
          </CardTitle>
          <CardDescription>
            Merci de confirmer votre disponibilité pour la réunion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Confirmation Dialog */}
          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmer votre choix</DialogTitle>
                <DialogDescription>
                  {isPresent
                    ? "Êtes-vous sûr de confirmer votre présence ?"
                    : "Êtes-vous sûr de confirmer votre absence ?"}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setConfirmOpen(false);
                    // Optionally redirect back if user cancels
                  }}
                >
                  Annuler
                </Button>
                <Button
                  className="bg-coral-600 hover:bg-coral-700"
                  onClick={() => {
                    setConfirmOpen(false);
                    handleConfirmPresence();
                  }}
                >
                  Confirmer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Status Block */}
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="h-12 w-12 rounded-full border-4 border-coral-200 border-t-coral-500 animate-spin" />
              <p className="text-sm text-muted-foreground">
                Traitement en cours…
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-3 py-6">
              {isPresent ? (
                <CheckCircle2 className="h-14 w-14 text-coral-600" />
              ) : (
                <CheckCircle2 className="h-14 w-14 text-crimson-600" />
              )}
              <h3 className="text-lg font-medium">
                {isPresent ? "Présence confirmée" : "Absence enregistrée"}
              </h3>
              <div className="mt-1 text-sm text-muted-foreground">
                <span
                  className={
                    isPresent
                      ? "inline-flex items-center rounded-full bg-coral-100 text-coral-700 px-3 py-1"
                      : "inline-flex items-center rounded-full bg-crimson-100 text-crimson-700 px-3 py-1"
                  }
                >
                  {isPresent ? "PRESENT" : "ABSENT"}
                </span>
              </div>

              <div className="mt-4 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                <Button
                  asChild
                  className="w-full bg-coral-600 hover:bg-coral-700"
                >
                  <Link href="/dashboard">Accueil</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-coral-300 text-coral-700 hover:bg-coral-50"
                  onClick={() => setConfirmOpen(true)}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reconfirmer
                </Button>
              </div>

              <div className="mt-6 flex flex-col items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  {email ? (
                    <>
                      <Mail className="h-4 w-4" />
                      <span>{email}</span>
                    </>
                  ) : (
                    <>
                      <UserRound className="h-4 w-4" />
                      <span>Utilisateur ID: {user_id ?? "-"}</span>
                    </>
                  )}
                </div>
                <div className="text-xs">Réunion ID: {reunion_id ?? "-"}</div>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-3 py-6">
              <CircleX className="h-14 w-14 text-crimson-600" />
              <h3 className="text-lg font-medium">Échec de la confirmation</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                {errorMsg ?? "Une erreur inattendue s'est produite."}
              </p>
              <div className="mt-2 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                <Button
                  className="w-full bg-crimson-400 hover:bg-crimson-500"
                  onClick={() => setConfirmOpen(true)}
                >
                  Réessayer
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-crimson-300 text-crimson-700 hover:bg-crimson-50"
                >
                  <Link href="/dashboard">Accueil</Link>
                </Button>
              </div>
              <div className="mt-4 text-xs text-muted-foreground text-center">
                Vérifiez que le lien contient bien les paramètres nécessaires
                (reunion_id et disponible {"PRESENT"} ou {"ABSENT"}).
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
