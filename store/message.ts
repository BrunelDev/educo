import { create } from 'zustand';
import { Message, Conversation } from '@/lib/api/message';

interface MessageStore {
  // State
  conversations: Conversation[];
  activeConversation: Conversation | null;
  isLoading: boolean;
  error: string | null;

  // Actions

  setActiveConversation: (conversation: Conversation | null) => void;
  addMessage: (conversationId: number, message: Message) => void;
  //updateMessageStatus: (conversationId: number, messageId: number, isRead: boolean) => void;
  setLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  // Initial state
  conversations: [],
  activeConversation: null,
  isLoading: false,
  error: null,

  // Actions



  setActiveConversation: (conversation) =>
    set({ activeConversation: conversation }),

    addMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...(conv.messages || []), message],
              derniere_activite: message.timestamp.toISOString(),
            }
          : conv
      ),
    })),

  /*updateMessageStatus: (conversationId, messageId, isRead) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: conv.messages.map((msg) =>
                msg.id === messageId ? { ...msg, is_read: isRead } : msg
              )
            }
          : conv
      )
    })),*/

  setLoading: (status) => 
    set({ isLoading: status }),

  setError: (error) => 
    set({ error })
}));