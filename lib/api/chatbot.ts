import api from "../../lib/api";
import { getCookies } from "@/lib/utils/cookies";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.100.2:8000/api/";

export const sendChatMessage = async (content: string) => {
  const response = await api.post("chat/message/", { content });
  return response.data;
};

export const streamChatMessage = async (
  content: string,
  signal?: AbortSignal
) => {
  const token = getCookies("access_token");
  const response = await fetch(`${BASE_URL}chat/message/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.body;
};

export const getChatHistory = async () => {
  const response = await api.get("chat/history/");
  return response.data;
};

export const clearChatHistory = async () => {
  const response = await api.delete("chat/history/");
  return response.data;
};
