import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send } from "lucide-react";
import { useRef, useState } from "react";

interface MessageInputProps {
  onSendMessage: (message: { type: string; message: string }) => void;
  isConnected: boolean;
  isLoading?: boolean;
}

export function MessageInput({
  onSendMessage,
  isConnected,
  isLoading = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && isConnected) {
      onSendMessage({
        type: "message",
        message: message.trim(),
      });
      setMessage("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isConnected) return;

    // Convert file to base64 or handle file upload as needed
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      onSendMessage({
        type: "message",
        message: base64,
      });
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
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
        disabled={!isConnected || isLoading}
        className="flex-1"
      />

      <Button
        type="submit"
        disabled={!message.trim() || !isConnected || isLoading}
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
}
