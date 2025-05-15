import { MessageType } from "@/lib/types";
import { getCookies } from "@/lib/utils/cookies";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Ellipsis, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export interface MessageSender {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Message {
  id: number;
  content: string;
  type_message: "text" | "file" | "image" | "audio";
  sender: MessageSender;
  timestamp: string;
  is_read: boolean;
  fichier?: string | null;
  image?: string | null;
  audio?: string | null;
}

interface MessageBoxProps {
  message: Message;
  isOwnMessage?: boolean;
  className?: string;
}

export default function MessageBox({ message, className }: MessageBoxProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const renderContent = () => {
    switch (message.type_message) {
      case MessageType.IMAGE:
        const imageSource = message.image || message.content;

        // Function to handle image loading errors
        const handleImageError = () => {
          setImageError(true);
        };

        // If there was an error loading the image
        if (imageError) {
          return (
            <div className="bg-red-50 text-red-500 p-3 rounded-md">
              <p>Impossible de charger l&apos;image</p>
              <p className="text-xs mt-1">
                URL: {imageSource?.substring(0, 50)}...
              </p>
            </div>
          );
        }

        return (
          imageSource && (
            <>
              <div
                className="max-w-[300px] relative group cursor-pointer"
                onClick={() => setIsImageModalOpen(true)}
              >
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <ZoomIn className="text-white" />
                </div>
                <Image
                  src={imageSource}
                  alt={`${message.sender.first_name}'s image`}
                  width={300}
                  height={200}
                  className="rounded-lg object-contain"
                  onError={handleImageError}
                />
              </div>

              {isImageModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
                  <div className="relative max-w-4xl max-h-[90vh] overflow-auto">
                    <button
                      className="absolute top-2 right-2 bg-white rounded-full p-1"
                      onClick={() => setIsImageModalOpen(false)}
                    >
                      <X className="h-6 w-6" />
                    </button>
                    <Image
                      src={imageSource}
                      alt={`${message.sender.first_name}'s image (full size)`}
                      width={1200}
                      height={800}
                      className="object-contain max-h-[90vh]"
                      onError={handleImageError}
                    />
                  </div>
                </div>
              )}
            </>
          )
        );
      case MessageType.AUDIO:
        const audioSource = message.audio || message.content;
        return (
          audioSource && (
            <audio controls className="max-w-full">
              <source src={audioSource} type="audio/mpeg" />
            </audio>
          )
        );
      case MessageType.FILE:
        const fileSource = message.fichier || message.content;

        // Check if this is actually an image that was misclassified
        const isActuallyImage =
          fileSource &&
          typeof fileSource === "string" &&
          (fileSource.startsWith("data:image/") ||
            /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileSource));

        // If it's actually an image, render it as an image
        if (isActuallyImage) {
          // Reuse the image rendering logic
          const handleImageError = () => {
            setImageError(true);
          };

          if (imageError) {
            return (
              <div className="bg-red-50 text-red-500 p-3 rounded-md">
                <p>Impossible de charger l&apos;image</p>
                <p className="text-xs mt-1">
                  URL: {fileSource?.substring(0, 50)}...
                </p>
              </div>
            );
          }

          return (
            fileSource && (
              <>
                <div
                  className="max-w-[300px] relative group cursor-pointer"
                  onClick={() => setIsImageModalOpen(true)}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <ZoomIn className="text-white" />
                  </div>
                  <Image
                    src={fileSource}
                    alt="Image"
                    width={300}
                    height={200}
                    className="rounded-lg object-contain"
                    onError={handleImageError}
                  />
                </div>

                {isImageModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl max-h-[90vh] overflow-auto">
                      <button
                        className="absolute top-2 right-2 bg-white rounded-full p-1"
                        onClick={() => setIsImageModalOpen(false)}
                      >
                        <X className="h-6 w-6" />
                      </button>
                      <Image
                        src={fileSource}
                        alt="Image (full size)"
                        width={1200}
                        height={800}
                        className="object-contain max-h-[90vh]"
                        onError={handleImageError}
                      />
                    </div>
                  </div>
                )}
              </>
            )
          );
        }

        // Extract filename from base64 if possible
        let fileName = "Fichier";
        if (fileSource && fileSource.includes(";name=")) {
          const nameMatch = fileSource.match(/;name=([^;]+)/);
          if (nameMatch && nameMatch[1]) {
            fileName = nameMatch[1];
          }
        } else if (fileSource && typeof fileSource === "string") {
          // Try to get filename from the end of the URL or path
          const urlParts = fileSource.split("/");
          if (urlParts.length > 0) {
            const lastPart = urlParts[urlParts.length - 1];
            if (lastPart && lastPart.length > 0) {
              fileName = lastPart;
            }
          }
        }

        return (
          fileSource && (
            <a
              href={fileSource}
              download
              className="flex items-center gap-2 text-blue-600 hover:underline bg-white-50 p-3 rounded-md"
            >
              📎 {fileName}
            </a>
          )
        );
      default:
        // Check if the text message is actually an image URL
        const isImageUrl =
          message.content &&
          typeof message.content === "string" &&
          (message.content.startsWith("http") ||
            message.content.startsWith("data:image/")) &&
          (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(message.content) ||
            message.content.startsWith("data:image/"));

        if (isImageUrl) {
          // Handle as image
          const handleImageError = () => {
            setImageError(true);
          };

          if (imageError) {
            return (
              <p
                className={`text-gray-800 bg-white-50 p-2 w-fit ${
                  message.sender.id ==
                  JSON.parse(getCookies("userInfo") || "")?.id
                    ? ""
                    : "rounded-b-[8px] rounded-tr-[8px]"
                } min-w-[100px] break-all max-w-[500px]`}
              >
                {message.content}
              </p>
            );
          }

          return (
            <>
              <div
                className="max-w-[300px] relative group cursor-pointer"
                onClick={() => setIsImageModalOpen(true)}
              >
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <ZoomIn className="text-white" />
                </div>
                <Image
                  src={message.content}
                  alt="Image"
                  width={300}
                  height={200}
                  className="rounded-lg object-contain"
                  onError={handleImageError}
                />
              </div>

              {isImageModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
                  <div className="relative max-w-4xl max-h-[90vh] overflow-auto">
                    <button
                      className="absolute top-2 right-2 bg-white rounded-full p-1"
                      onClick={() => setIsImageModalOpen(false)}
                    >
                      <X className="h-6 w-6" />
                    </button>
                    <Image
                      src={message.content}
                      alt="Image (full size)"
                      width={1200}
                      height={800}
                      className="object-contain max-h-[90vh]"
                      onError={handleImageError}
                    />
                  </div>
                </div>
              )}
            </>
          );
        }

        // Regular text message
        return (
          <p
            className={`text-gray-800 bg-white-50 p-2 w-fit ${
              message.sender.id == JSON.parse(getCookies("userInfo") || "")?.id
                ? ""
                : "rounded-b-[8px] rounded-tr-[8px]"
            } min-w-[100px] break-all max-w-[500px]`}
          >
            {message.content}
          </p>
        );
    }
  };

  return (
    <div
      className={`flex gap-4 p-4 w-fit ${className} my-8 ${
        message.sender.id == JSON.parse(getCookies("userInfo") || "")?.id
          ? "ml-auto"
          : ""
      }`}
    >
      <Image
        src={"/userProfile-img.png"}
        alt={message.sender.email}
        width={30}
        height={30}
        className="rounded-full w-[30px] h-[30px]"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">{message.sender.first_name}</span>
        </div>
        <div className="relative w-fit">
          {renderContent()}
          <span className="text-sm text-gray-500 absolute right-0 -bottom-6 text-nowrap">
            {formatDistanceToNow(message.timestamp, {
              locale: fr,
              addSuffix: true,
            })}
          </span>
          <Ellipsis size={18} className="absolute top-1 -right-6" />
        </div>
      </div>
    </div>
  );
}
