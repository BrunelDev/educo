import api, { endpoints } from "../api";
const endpoint = endpoints.consultations.comment.base
interface Commenter {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  nom_complet: string;
}

interface Comment {
  contenu: string;
  consultation: number;
  utilisateur: Commenter;
  date_creation: string;
  date_modification: string;
}
interface createCommentDto {
    contenu: string;
    consultation: number;
}

export const sendComment = async (data: createCommentDto) => {
    try {
        const res = await api.post<Comment>(endpoint, data)
        return res.data;
    } catch (error: unknown) {
        console.error("Error sending comment:", error);
        throw error;    
        
    }
    
}

export const getComments = async () => {
    try {
        const res = await api.get<Comment[]>(`${endpoint}`)
        return res.data;
    } catch (error: unknown) {
        console.error("Error fetching comments:", error);
        throw error;    
        
    }
    
 
}
