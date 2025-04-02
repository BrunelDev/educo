"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ActivationPage({
  params,
}: {
  params: { uid: string; token: string };
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const activateAccount = async () => {
      const { uid, token } = params;
      if (!uid || !token) {
        setStatus("error");
        setMessage("Invalid activation link");
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
          setMessage(data.message || "Activation failed");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred during activation");
        console.error("Activation error:", error);
      }
    };

    activateAccount();
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          {status === "loading" && (
            <div className="animate-pulse">
              <h2 className="text-2xl font-bold text-gray-900">
                Activation du compte...
              </h2>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-green-600">
                Compte activé!
              </h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500">
                Redirection vers le tableau de bord dans 3 secondes...
              </p>
              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full"
              >
                Aller au tableau de bord maintenant
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-red-600">
                Activation échouée.
              </h2>
              <p className="text-gray-600">{message}</p>
              <Button onClick={() => router.push("/login")} className="w-full">
                Retourner a la page de connexion
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
