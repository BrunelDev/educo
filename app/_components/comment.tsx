"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
  Comment,
  CommentsListResponse,
  CreateCommentDto,
  UpdateCommentDto,
} from "@/lib/api/reunion";
import { getUser, User } from "@/lib/api/users";
import { isAxiosError } from "axios";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Edit,
  MessageCircle,
  MessageCircleMore,
  //Heart,
  MoreHorizontal,
  Send,
  Trash2,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// Props interfaces
interface CommentItemProps {
  comment: Comment;
  currentUserId?: number;
  onReply?: (parentId: number) => void;
  onEdit?: (comment: Comment) => void;
  onDelete?: (commentId: number) => void;
  depth?: number;
  deleteComment: (commentId: number) => Promise<void>;
  createComment: (data: CreateCommentDto) => Promise<Comment>;
}

interface CommentFormProps {
  reunionId: number;
  parentId?: number | null;
  placeholder?: string;
  onSubmit?: (comment: Comment) => void;
  onCancel?: () => void;
  initialValue?: string;
  isEditing?: boolean;
  userData?: User | null;
  createComment: (data: CreateCommentDto) => Promise<Comment>;
}

interface CommentListProps {
  reunionId: number;
  currentUserId?: number;
  getComments: (id: number) => Promise<CommentsListResponse>;
  createComment: (data: CreateCommentDto) => Promise<Comment>;
  updateComment: (
    commentId: number,
    data: UpdateCommentDto
  ) => Promise<Comment>;
  deleteComment: (commentId: number) => Promise<void>;
}

// Individual Comment Component
export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  depth = 0,
  deleteComment,
  createComment,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  //const [isLiked, setIsLiked] = useState(false);
  //const [likeCount, setLikeCount] = useState(0);

  const maxDepth = 3; // Limit nesting depth like Twitter

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: fr,
    });
  };

  /*const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };*/

  const handleReply = () => {
    if (depth < maxDepth) {
      setShowReplyForm(true);
    } else {
      onReply?.(comment.parent || comment.id || 0);
    }
  };

  const handleEdit = () => {
    onEdit?.(comment);
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      try {
        await deleteComment(comment.id);
        onDelete?.(comment.id);
        toast.success("Commentaire supprimé avec succès");
      } catch {
        toast.error("Erreur lors de la suppression du commentaire");
      }
    }
  };

  const handleReplySubmit = () => {
    setShowReplyForm(false);
    // The parent component should handle adding the new comment to the list
  };

  const [userData, setUserData] = useState<User | null>(null);
  useEffect(() => {
    const getUserData = async () => {
      const userData = await getUser();
      console.log("userData", userData);
      setUserData(userData);
    };
    getUserData();
  }, []);
  const isAuthor = !!(
    userData?.id &&
    comment.auteur &&
    userData.id === comment.auteur.id
  );

  return (
    <div className={`${depth > 0 ? "ml-12" : ""}`}>
      <Card className="border-0 shadow-none bg-transparent m-0 p-0">
        <CardContent className="p-4 rounded-lg">
          <div className="flex space-x-3">
            {/* Avatar */}
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage
                src={comment.auteur?.photo || ""}
                alt={comment.auteur?.nom_complet ?? "Utilisateur"}
              />
              <AvatarFallback className="bg-gradient-to-r from-coral-400 to-crimson-400 text-white text-sm font-medium">
                {getInitials(comment.auteur?.nom_complet ?? "Utilisateur")}
              </AvatarFallback>
            </Avatar>

            {/* Comment Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {comment.auteur?.nom_complet ?? "Utilisateur inconnu"}
                  </h4>
                  <span className="text-gray-500 text-xs">
                    {formatDate(comment.date_creation)}
                  </span>
                  {comment.est_reponse && (
                    <span className="text-coral-500 text-xs font-medium">
                      • Réponse
                    </span>
                  )}
                </div>

                {/* Actions Menu */}
                {isAuthor && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleEdit}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleDelete}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Comment Text */}
              <div className="mt-1">
                <p className="text-gray-900 text-sm leading-relaxed whitespace-pre-wrap">
                  {comment.contenu}
                </p>
              </div>

              {/* Action Buttons */}
              {(() => {
                const repliesCount = Array.isArray(comment.reponses)
                  ? comment.reponses.length
                  : 0;
                return (
                  <div className="flex items-center space-x-6 mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReply}
                      className="text-gray-500 hover:text-orange-600 hover:bg-orange-50 h-8 px-2 transition-colors"
                    >
                      <MessageCircleMore className="h-4 w-4 mr-1" />
                      <span className="text-xs">
                        {repliesCount > 0 ? repliesCount : ""}
                      </span>
                    </Button>

                    {/* Show/Hide Replies Button */}
                    {repliesCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowReplies(!showReplies)}
                        className="text-gray-500 hover:text-orange-600 hover:bg-orange-50 h-8 px-2 transition-colors"
                      >
                        <span className="text-xs">
                          {showReplies
                            ? "Masquer les réponses"
                            : `Afficher les réponses (${repliesCount})`}
                        </span>
                      </Button>
                    )}
                  </div>
                );
              })()}

              {/* Reply Form */}
              {showReplyForm && (
                <div className="mt-4">
                  <CommentForm
                    userData={userData}
                    reunionId={comment.reunion || comment.tache}
                    parentId={comment.id}
                    placeholder="Répondre à ce commentaire..."
                    onSubmit={handleReplySubmit}
                    onCancel={() => setShowReplyForm(false)}
                    createComment={createComment}
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nested Replies */}
      {comment.reponses &&
        comment.reponses.length > 0 &&
        depth < maxDepth &&
        showReplies && (
          <div className="mt-0">
            {comment.reponses.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                currentUserId={currentUserId}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                depth={depth + 1}
                deleteComment={deleteComment}
                createComment={createComment}
              />
            ))}
          </div>
        )}

      {/* Show more replies indicator */}
      {Array.isArray(comment.reponses) &&
        comment.reponses.length > 0 &&
        depth >= maxDepth && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-12 mt-2 text-blue-600 hover:text-blue-700 text-xs"
            onClick={() => onReply?.(comment.id)}
          >
            Voir {comment.reponses.length} réponse
            {comment.reponses.length > 1 ? "s" : ""}
          </Button>
        )}
    </div>
  );
};

// Comment Form Component
export const CommentForm: React.FC<CommentFormProps> = ({
  reunionId,
  parentId = null,
  placeholder = "Ajouter un commentaire...",
  onSubmit,
  onCancel,
  initialValue = "",
  isEditing = false,
  userData,
  createComment,
}) => {
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      if (isEditing) {
        // For editing, delegate to onSubmit; parent handles update API
        onSubmit?.({
          // Minimal object carrying edited content
          id: 0,
          reunion: reunionId,
          contenu: content.trim(),
          auteur: {
            id: 0,
            email: "",
            first_name: "",
            last_name: "",
            nom_complet: "",
          },
          date_creation: new Date().toISOString(),
          date_modification: new Date().toISOString(),
          parent: parentId ?? null,
          reponses: [],
          est_reponse: !!parentId,
          niveau_profondeur: 0,
        } as unknown as Comment);
      } else {
        const commentData: CreateCommentDto = {
          reunion: reunionId,
          tache: reunionId,
          contenu: content.trim(),
          parent: parentId,
        };
        console.log("DTO", commentData);
        const newComment = await createComment(commentData);
        onSubmit?.(newComment);
      }
      setContent("");
      toast.success("Commentaire ajouté avec succès");
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 400) {
        toast.error(error.response.data.tache);
      } else {
        toast.error("Erreur lors de l'ajout du commentaire");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent(initialValue);
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex space-x-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={userData?.image || ""} />
          <AvatarFallback className="bg-gradient-to-r from-coral-400 to-crimson-400 text-white text-sm font-medium">
            {getInitials(
              userData?.first_name + " " + userData?.last_name ||
                userData?.email ||
                ""
            )}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="min-h-[80px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        {(onCancel || isEditing) && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          disabled={!content.trim() || isSubmitting}
          className="bg-gradient-to-r from-coral-400 to-crimson-400 hover:bg-gradient-to-r hover:from-coral-500 hover:to-crimson-500"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              <span>Envoi...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Send className="h-4 w-4" />
              <span>{isEditing ? "Modifier" : "Commenter"}</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
};

// Comment List Component
export const CommentList: React.FC<CommentListProps> = ({
  reunionId,
  currentUserId,
  getComments,
  createComment,
  updateComment,
  deleteComment,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getComments(reunionId);
      console.log("-------Liste des commentaires---------", response);
      setComments(response.results);
    } catch {
      toast.error("Erreur lors du chargement des commentaires");
    } finally {
      setLoading(false);
    }
  }, [getComments, reunionId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleNewComment = (newComment: Comment) => {
    if (newComment.parent) {
      // This is a reply - we should refresh to get the updated structure
      fetchComments();
    } else {
      // This is a new top-level comment
      setComments((prev) => [...prev, newComment]);
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment);
  };

  const handleUpdateComment = async (updatedContent: string) => {
    if (!editingComment) return;

    try {
      const updateData: UpdateCommentDto = { contenu: updatedContent };
      await updateComment(editingComment.id, updateData);

      // Update the comment in the list
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === editingComment.id
            ? { ...comment, contenu: updatedContent }
            : comment
        )
      );

      setEditingComment(null);
      toast.success("Commentaire modifié avec succès");
    } catch {
      toast.error("Erreur lors de la modification du commentaire");
    }
  };

  const handleDeleteComment = (commentId: number) => {
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
  };

  const handleReply = () => {
    // Scroll to comment form or show reply dialog
    const commentForm = document.getElementById("comment-form");
    commentForm?.scrollIntoView({ behavior: "smooth" });
  };
  const [userData, setUserData] = useState<User | null>(null);
  useEffect(() => {
    const getUserData = async () => {
      const userData = await getUser();
      setUserData(userData);
      console.log("userData///////////*------------------", userData);
    };
    getUserData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex space-x-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="">
      {/* Comment Form */}
      <div id="comment-form">
        <CommentForm
          userData={userData}
          reunionId={reunionId}
          onSubmit={handleNewComment}
          placeholder="Que pensez-vous de cette réunion ?"
          createComment={createComment}
        />
      </div>

      {/* Comments List */}
      <div className="space-y-1">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun commentaire
            </h3>
            <p className="text-gray-500">
              Soyez le premier à commenter cette réunion.
            </p>
          </div>
        ) : (
          comments
            .filter((comment) => comment.parent === null)
            .map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                onReply={handleReply}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
                deleteComment={deleteComment}
                createComment={createComment}
              />
            ))
        )}
      </div>

      {/* Edit Comment Dialog */}
      <Dialog
        open={!!editingComment}
        onOpenChange={() => setEditingComment(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le commentaire</DialogTitle>
          </DialogHeader>
          {editingComment && (
            <CommentForm
              userData={userData}
              reunionId={editingComment.reunion}
              initialValue={editingComment.contenu}
              isEditing
              onSubmit={(comment) => handleUpdateComment(comment.contenu)}
              onCancel={() => setEditingComment(null)}
              placeholder="Modifier votre commentaire..."
              createComment={createComment}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Main Comment Section Component
export const CommentSection: React.FC<{
  type?: "reunion" | "tache";
  reunionId: number;
  currentUserId?: number;
  createComment: (data: CreateCommentDto) => Promise<Comment>;
  updateComment: (
    commentId: number,
    data: UpdateCommentDto
  ) => Promise<Comment>;
  deleteComment: (commentId: number) => Promise<void>;
  getComments: (id: number) => Promise<CommentsListResponse>;
}> = ({
  reunionId,
  currentUserId,
  getComments,
  createComment,
  updateComment,
  deleteComment,
}) => {
  return (
    <div className="max-w-2xl ">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Commentaires
        </h2>
        <p className="text-gray-600 text-sm">
          Partagez vos réflexions sur cette réunion
        </p>
      </div>

      <CommentList
        reunionId={reunionId}
        currentUserId={currentUserId}
        getComments={getComments}
        createComment={createComment}
        updateComment={updateComment}
        deleteComment={deleteComment}
      />
    </div>
  );
};

export default CommentSection;

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
