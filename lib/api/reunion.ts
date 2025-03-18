import api, { endpoints } from "../api";
import { Meeting } from "../types";
const endpoint = endpoints.meetings.list;



export const getMeetings  = async (page: number = 1) : Promise<Meeting[]> => {
  try {
    const response = await api.get(endpoint, {
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
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching meeting", error);
    throw error;
  }
};
