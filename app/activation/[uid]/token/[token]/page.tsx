"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function ActivationPage({
  params,
}: {
  params: Promise<{ uid: string; token: string }>;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const { uid, token } = use(params);

  useEffect(() => {
    const activateAccount = async () => {
      if (!uid || !token) {
        setStatus("error");
        setMessage("Lien d'activation invalide");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}auth/utilisateurs/verify_activation/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid, token }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message);
          // Automatic redirect after 3 seconds
          setTimeout(() => {
            router.push("/dashboard");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.message || "Échec de l'activation");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Une erreur s'est produite lors de l'activation");
        console.error("Erreur d'activation:", error);
      }
    };

    activateAccount();
  }, [params, router, token, uid]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          {status === "loading" && (
            <div className="animate-pulse">
              <h2 className="text-2xl font-bold text-gray-900">
                Activation du compte en cours...
              </h2>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-green-600">
                Compte activé avec succès !
              </h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500">
                Redirection vers la page de connexion dans 3 secondes...
              </p>
              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full"
              >
                Aller à la page de connexion maintenant
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-red-600">
                Échec de l&apos;activation
              </h2>
              <p className="text-gray-600">{message}</p>
              <Button onClick={() => router.push("/login")} className="w-full">
                Retourner à la page de connexion
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
