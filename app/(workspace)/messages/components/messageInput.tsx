import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadToS3 } from "@/lib/s3-upload";
import { MessageType } from "@/lib/types";
import { Paperclip, Send, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface MessageInputProps {
  onSendMessage: (message: {
    type: string;
    message: string;
    messageType?: string;
  }) => void;
  isConnected: boolean;
  isLoading?: boolean;
}

// Maximum file size in bytes (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function MessageInput({
  onSendMessage,
  isConnected,
  isLoading: externalLoading = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileToSend, setFileToSend] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Combine external loading state with our internal uploading state
  const isLoading = externalLoading || isUploading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If there's an image to send
    if (fileToSend && imagePreview && isConnected) {
      sendFile();
      return;
    }

    // Otherwise send text message
    if (message.trim() && isConnected) {
      onSendMessage({
        type: "message",
        message: message.trim(),
        messageType: MessageType.TEXT,
      });
      setMessage("");
    }
  };

  // Function to upload file to S3 and send the URL in a message
  const sendFile = async () => {
    if (!fileToSend || !isConnected) return;

    try {
      // Determine message type based on file type
      const isImage = fileToSend.type.startsWith("image/");
      const isAudio = fileToSend.type.startsWith("audio/");

      let messageType = MessageType.FILE;
      if (isImage) messageType = MessageType.IMAGE;
      if (isAudio) messageType = MessageType.AUDIO;

      // Set loading state
      setIsUploading(true);

      // Show loading toast
      const loadingToast = toast.loading(
        isImage
          ? "Envoi de l'image en cours..."
          : isAudio
          ? "Envoi de l'audio en cours..."
          : "Envoi du fichier en cours..."
      );

      try {
        // Upload the file to S3 using the uploadToS3 function
        const uploadedUrls = await uploadToS3([fileToSend]);

        if (uploadedUrls && uploadedUrls.length > 0) {
          const fileUrl = uploadedUrls[0];

          // Send the message with the S3 URL
          onSendMessage({
            type: "message",
            message: fileUrl, // Use the S3 URL directly
            messageType: messageType,
          });

          // Show success toast
          toast.success(
            isImage
              ? "Image envoyée avec succès"
              : isAudio
              ? "Audio envoyé avec succès"
              : "Fichier envoyé avec succès"
          );

          // Reset after sending
          clearFileSelection();
        } else {
          throw new Error("No URL returned from S3 upload");
        }
      } catch (uploadError) {
        console.error("Error uploading to S3:", uploadError);
        setFileError("Erreur lors de l'envoi du fichier. Veuillez réessayer.");
        toast.error("Échec de l'envoi. Veuillez réessayer.");
      } finally {
        // Dismiss loading toast
        toast.dismiss(loadingToast);
        setIsUploading(false);
      }
    } catch (error) {
      console.error("Error in file sending process:", error);
      setFileError("Erreur lors de l'envoi du fichier. Veuillez réessayer.");
      toast.error("Échec de l'envoi. Veuillez réessayer.");
      setIsUploading(false);
    }
  };

  const clearFileSelection = () => {
    setImagePreview(null);
    setFileToSend(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isConnected) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setFileError(
        `Le fichier est trop volumineux. Taille maximale: ${
          MAX_FILE_SIZE / (1024 * 1024)
        }MB`
      );
      return;
    }

    setFileError(null);
    setFileToSend(file);

    // If it's an image, create a preview
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // For non-image files, just store the file name as preview
      setImagePreview(`Fichier: ${file.name}`);
    }
  };

  return (
    <div className="flex flex-col">
      {fileError && (
        <div className="bg-red-100 text-red-600 p-2 mx-4 rounded-md mb-2">
          {fileError}
        </div>
      )}

      {imagePreview && (
        <div className="relative mx-4 mb-2">
          <div className="flex items-start gap-2 p-2 border rounded-md">
            {fileToSend?.type.startsWith("image/") ? (
              <div className="relative w-32 h-32">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className={`object-cover rounded-md ${
                    isUploading ? "opacity-50" : ""
                  }`}
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-coral-500"></div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`p-2 bg-gray-100 rounded-md ${
                  isUploading ? "opacity-50" : ""
                }`}
              >
                {imagePreview}
                {isUploading && (
                  <div className="ml-2 inline-block">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-coral-500"></div>
                  </div>
                )}
              </div>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 bg-white rounded-full"
              onClick={clearFileSelection}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,audio/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={!isConnected || isLoading}
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={!isConnected ? "Déconnecté..." : "Votre message..."}
          disabled={!isConnected || isLoading || !!fileToSend}
          className="flex-1"
        />

        <Button
          type="submit"
          disabled={
            (!message.trim() && !fileToSend) || !isConnected || isLoading
          }
        >
          {isUploading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </form>
    </div>
  );
}
