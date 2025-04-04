import api, { endpoints } from "../api";

const endpoint = endpoints.notifications.base;

interface NotificationContentInfo {
  type: string;
  id: number;
  str_representation: string;
}

export interface Notification {
  id: number;
  destinataire: number;
  destinataire_nom: string;
  titre: string;
  message: string;
  type_notification: "INFO" | "WARNING" | "ERROR";
  type_notification_display: string;
  est_lu: boolean;
  content_type: number;
  object_id: number;
  contenu_associe_info: NotificationContentInfo;
  date_creation: string;
  date_modification: string;
  date_creation_formatted: string;
  url: string;
}

export interface NotificationApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
}

interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export const getNotifications = async ({
  page = 1
}: PaginationParams = {}): Promise<NotificationApiResponse> => {
  try {
    const response = await api.get<NotificationApiResponse>(endpoint, {
      params: {
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error
  }
};
