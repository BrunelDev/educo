import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWebSocket } from "@/hooks/useWebSocket";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";

interface ChatRoomProps {
  roomId: string;
}

export function ChatRoom({ roomId }: ChatRoomProps) {
  const [newMessage, setNewMessage] = useState("");
  const { isConnected, messages, sendMessage } = useWebSocket(roomId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    sendMessage(newMessage);
    setNewMessage("");
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-gray-500">Connexion au chat en cours...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold">Chat en direct</h2>
        <p className="text-sm text-green-600">Connecté</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              message.sender?.username === "vous" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender?.username === "vous"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              <p className="text-sm font-semibold mb-1">
                {message.sender?.username || "Anonyme"}
              </p>
              <p>{message.message}</p>
              {message.timestamp && (
                <p className="text-xs mt-1 opacity-75">
                  {format(new Date(message.timestamp), "HH:mm", {
                    locale: fr,
                  })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Envoyer
          </Button>
        </div>
      </form>
    </div>
  );
}
