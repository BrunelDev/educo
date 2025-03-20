import { MeetingType } from "@/lib/types";
import { create } from "zustand";

interface MeetingFormState {
  // Step 1 - General Information
  meetingType: MeetingType;
  title: string;
  purpose: string;
  locations: ("physique" | "enligne")[];
  meetingLink?: string;

  // Step 2 - Schedule
  dateTime: string;
  frequency: "once" | "weekly" | "monthly";
  documents: Array<{
    file: File;
    fileUrl: string;
  }>;

  // Step 3 - Participants
  participants: Array<{
    utilisateur: number;
    est_hote: boolean;
    statut_invitation: "EN_ATTENTE" | "ACCEPTE" | "REFUSE";
  }>;

  // Step 4 - Agenda
  agenda: Array<{
    description: string;
  }>;

  // Form Actions
  updateStep1: (
    data: Partial<{
      meetingType: MeetingType;
      title: string;
      purpose: string;
      locations: ("physique" | "enligne")[];
      meetingLink: string;
    }>
  ) => void;

  updateStep2: (
    data: Partial<{
      dateTime: string;
      frequency: "once" | "weekly" | "monthly";
      documents: Array<{ file: File; fileUrl: string }>;
    }>
  ) => void;

  updateStep3: (
    participants: Array<{
      utilisateur: number;
      est_hote: boolean;
      statut_invitation: "EN_ATTENTE" | "ACCEPTE" | "REFUSE";
    }>
  ) => void;

  updateStep4: (agenda: Array<{ description: string }>) => void;

  resetForm: () => void;
}

const initialState = {
  meetingType: MeetingType.Ordinary,
  title: "",
  purpose: "",
  locations: [],
  meetingLink: "",
  dateTime: "",
  frequency: "once" as const,
  documents: [],
  participants: [],
  agenda: [],
};

export const useMeetingForm = create<MeetingFormState>((set) => ({
  ...initialState,

  updateStep1: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),

  updateStep2: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),

  updateStep3: (participants) =>
    set((state) => ({
      ...state,
      participants,
    })),

  updateStep4: (agenda) =>
    set((state) => ({
      ...state,
      agenda,
    })),

  resetForm: () => set(initialState),
}));
