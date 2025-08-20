import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export function CompteRendu({
  handleSubmiting,
  initialCompteRendu,
}: {
  handleSubmiting: (text: string) => Promise<void>;
  initialCompteRendu: string;
}) {
  const [isEditingCompteRendu, setIsEditingCompteRendu] =
    useState<boolean>(false);
  const [compteRenduText, setCompteRenduText] =
    useState<string>(initialCompteRendu);
  const submitCompteRendu = async () => {
    toast.loading("Enregistrement du compte rendu...");
    try {
      await handleSubmiting(compteRenduText);

      toast.dismiss();
      toast.success("Compte rendu enregistré avec succès.");
      setIsEditingCompteRendu(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du compte rendu:", error);
      toast.dismiss();
      toast.error("Erreur lors de l'enregistrement du compte rendu.");
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-md font-semibold">Compte Rendu</h2>
        <Button
          onClick={() => {
            if (isEditingCompteRendu) {
              submitCompteRendu();
            } else {
              setIsEditingCompteRendu(true);
            }
          }}
          variant={"default"}
          className={`text-white ${
            isEditingCompteRendu
              ? "bg-gradient-to-r from-coral-400 to-crimson-400 hover:brightness-95"
              : "bg-gradient-to-r from-coral-400 to-crimson-400 hover:brightness-95"
          }`}
        >
          {isEditingCompteRendu ? "Confirmer" : "Modifier"}
        </Button>
      </div>
      <div className="mt-4 w-full">
        {isEditingCompteRendu ? (
          <textarea
            value={compteRenduText}
            onChange={(e) => setCompteRenduText(e.target.value)}
            className="w-full p-2 border rounded-md min-h-[200px] bg-transparent"
            placeholder="Rédigez votre compte rendu ici..."
          />
        ) : (
          <div className="p-2 border rounded-md min-h-[200px] bg-gray-50 whitespace-pre-wrap">
            {compteRenduText || "Aucun compte rendu pour le moment."}
          </div>
        )}
      </div>
    </div>
  );
}
