import { MeetingFormState } from "@/store/meetingForm";
import api, { endpoints } from "../api";
import { Meeting } from "../types";
const endpoint = endpoints.meetings;

export const getMeetings = async (page: number = 1): Promise<Meeting[]> => {
  try {
    const response = await api.get(endpoint.list, {
      params: {
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching meetings", error);
    throw error;
  }
};

export const getOneMeting = async (id: number) => {
  try {
    const response = await api.get(`${endpoint.list}/${id}`);
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching meeting", error);
    throw error;
  }
};

export const createMeeting = async (meeting: MeetingFormState) => {
  try {
    const response = await api.post(endpoint.create, meeting);
    return response.data;
  } catch (error) {
    console.error("Error creating meeting", error);
    throw error;
  }
};
