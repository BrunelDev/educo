import { Meeting } from "@/lib/types";
import { create } from "zustand";

interface MeetingStore {
  // State
  meetings: Meeting[];
  currentMeeting: Meeting | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setMeetings: (meetings: Meeting[]) => void;
  addMeeting: (meeting: Meeting) => void;
  updateMeeting: (updatedMeeting: Meeting) => void;
  deleteMeeting: (meetingId: number) => void;
  setCurrentMeeting: (meeting: Meeting | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export  const useMeetingStore = create<MeetingStore>((set) => ({
  // Initial state
  meetings: [],
  currentMeeting: null,
  isLoading: false,
  error: null,

  // Actions
  setMeetings: (meetings) => 
    set(() => ({ meetings, error: null })),

  addMeeting: (meeting) => 
    set((state) => ({ 
      meetings: [...state.meetings, meeting],
      error: null 
    })),

  updateMeeting: (updatedMeeting) =>
    set((state) => ({
      meetings: state.meetings.map((meeting) =>
        meeting.id === updatedMeeting.id ? updatedMeeting : meeting
      ),
      error: null
    })),

  deleteMeeting: (meetingId) =>
    set((state) => ({
      meetings: state.meetings.filter((meeting) => meeting.id !== meetingId),
      error: null
    })),

  setCurrentMeeting: (meeting) => 
    set(() => ({ currentMeeting: meeting })),

  setLoading: (loading) => 
    set(() => ({ isLoading: loading })),

  setError: (error) => 
    set(() => ({ error })),
}));