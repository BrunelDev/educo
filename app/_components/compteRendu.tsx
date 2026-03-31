import "@/app/_components/editorPlugins/style.css";
import { Button } from "@/components/ui/button";
import { useMeetingForm } from "@/store/meetingForm";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Editor from "./editor";
import { convertLexicalJsonToHtml } from "./lexicalViewer";

export function CompteRendu({
  handleSubmiting,
  initialCompteRendu,
  firstPage,
}: {
  handleSubmiting: (text: string) => Promise<void>;
  initialCompteRendu: string;
  firstPage: string;
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
console.error(error)
      ;
      toast.dismiss();
      if (isAxiosError(error) && error.response?.status === 403) {
        toast.error(error.response.data.detail);
      } else {
        toast.error("Erreur lors de l'enregistrement du compte rendu.");
      }
    }
  };

  const formData = useMeetingForm();
  useEffect(() => {
    ;
  }, [formData]);
  const handleDownload = async () => {
    try {
      ;
      const htmlString = convertLexicalJsonToHtml(
        formData?.ordre_du_jour[0]?.description || ""
      );
      ;
      ;

      ;
      ;

      let finalHtmlString = firstPage + htmlString;
      if (!htmlString || htmlString.trim() === "" || htmlString === "<p></p>") {
        // Use fallback content if no valid HTML is generated
        finalHtmlString = `
          <h1>Compte Rendu de Réunion</h1>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString(
            "fr-FR"
          )}</p>
          <h2>Ordre du jour</h2>
          <p>${
            formData?.ordre_du_jour[0]?.description ||
            "Aucun contenu disponible"
          }</p>
          <h2>Compte rendu</h2>
          <p>${compteRenduText || "Aucun compte rendu disponible"}</p>
        `;
      }

      const response = await fetch("/api/export-docx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ htmlString: finalHtmlString }),
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      // Create blob and download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "compte-rendu.docx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Compte rendu téléchargé avec succès.");
    } catch (error) {
console.error(error)
      ;
      toast.error("Erreur lors du téléchargement du compte rendu.");
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-md font-semibold">Compte Rendu</h2>
        {/* <Button
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
        </Button> */}
      </div>
      {/* <div className="mt-4 w-full">
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
      </div> */}
      <Editor />
      <div>
        <Button className="sm:ml-auto" onClick={handleDownload}>
          Télécharger
        </Button>
      </div>
    </div>
  );
}
