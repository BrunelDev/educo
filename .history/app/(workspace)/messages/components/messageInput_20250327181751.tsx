import { Input } from "@/components/ui/input";
import { MessageType } from "@/lib/types";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Mic, Paperclip, Smile } from "lucide-react";
import React, { useRef, useState } from "react";

interface MessageInputProps {
  onSendMessage: (content: string, type: MessageType, file?: File) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message, MessageType.TEXT);
      setMessage("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      let type: MessageType = MessageType.FILE;

      if (file.type.startsWith("image/")) {
        type = MessageType.IMAGE;
      } else if (file.type.startsWith("audio/")) {
        type = MessageType.AUDIO;
      }

      onSendMessage(content, type, file);
    };
    reader.readAsDataURL(file);
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div>
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
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={!message.trim()}
          className="disabled:opacity-50"
        >
          <Mic />
        </button>
      </form>
    </div>
  );
}
