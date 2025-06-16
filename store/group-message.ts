import { create } from 'zustand';
import { Group, GroupMessage } from '@/lib/api/message'; // Assuming types will be in message.ts

interface GroupMessageStore {
  // State
  groupList: Group[];
  activeGroup: Group | null;
  groupMessages: { [groupId: number]: GroupMessage[] };
  isLoading: boolean;
  error: string | null;

  // Actions
  setGroupList: (groups: Group[]) => void;
  setActiveGroup: (group: Group | null) => void;
  addMessageToGroup: (groupId: number, message: GroupMessage) => void;
  setMessagesForGroup: (groupId: number, messages: GroupMessage[]) => void;
  setLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
}

export const useGroupMessageStore = create<GroupMessageStore>((set) => ({
  // Initial state
  groupList: [],
  activeGroup: null,
  groupMessages: {},
  isLoading: false,
  error: null,

  // Actions
  setGroupList: (groups) => set({ groupList: groups }),
  setActiveGroup: (group) => set({ activeGroup: group }),
  addMessageToGroup: (groupId, message) => set((state) => ({
    groupMessages: {
      ...state.groupMessages,
      [groupId]: [...(state.groupMessages[groupId] || []), message],
    },
  })),
  setMessagesForGroup: (groupId, messages) => set(state => ({
    groupMessages: {
        ...state.groupMessages,
        [groupId]: messages
    }
  })),
  setLoading: (status) => set({ isLoading: status }),
  setError: (error) => set({ error: error }),
}));
