import { Input } from "@/components/ui/input";
import { MessageType } from "@/lib/types";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Paperclip, Send, Smile } from "lucide-react";
import React, { useRef, useState } from "react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      const messageContent = JSON.stringify({
        type: getFileType(file),
        content: base64,
        filename: file.name,
      });
      onSendMessage(messageContent);
    } catch (error) {
      console.error("Erreur lors du traitement du fichier:", error);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(",")[1]); // Enlever le préfixe data:image/...
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const getFileType = (file: File): MessageType => {
    if (file.type.startsWith("image/")) {
      return MessageType.IMAGE;
    } else if (file.type.startsWith("audio/")) {
      return MessageType.AUDIO;
    }
    return MessageType.FILE;
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="relative">
      {showEmojiPicker && (
        <div className="absolute bottom-full right-0">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-4 border-t"
      >
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,audio/*,.pdf,.doc,.docx"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Paperclip className="w-5 h-5 text-gray-500" />
        </button>

        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Smile className="w-5 h-5 text-gray-500" />
        </button>

        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Écrivez votre message..."
          className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={!message.trim()}
          className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:hover:bg-transparent"
        >
          <Send className="w-5 h-5 text-gray-500" />
        </button>
      </form>
    </div>
  );
}
