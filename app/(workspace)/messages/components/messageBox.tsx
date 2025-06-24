import { Message, MessageType } from "@/lib/types";
import { getCookies } from "@/lib/utils/cookies";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Download,
  ExternalLink,
  File,
  FileAudio,
  FileImage,
  FileSpreadsheet,
  FileText,
  X,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getUser, User } from "@/lib/api/users";
import "react-h5-audio-player/lib/styles.css";

export interface MessageSender {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}
/**
 * content
: 
"audio"
file_name
: 
"1750613415448-WhatsApp Audio 2025-06-19 à 23.31.17_1087db7d.waptt.opus"
file_type
: 
"audio/ogg"
file_url
: 
"https://cse-impact.s3.eu-north-1.amazonaws.com/public/1750613415448-WhatsApp Audio 2025-06-19 à 23.31.17_1087db7d.waptt.opus"
id
: 
19
is_read
: 
false
sender
: 
{id: 4, email: 'ahokpossibrunel@gmail.com'}
sender_id
: 
4
timestamp
: 
"2025-06-22T17:30:17.081680+00:00"
type_message
: 
"audio"
 */


interface MessageBoxProps {
  message: Message;
  isOwnMessage?: boolean;
  className?: string;
  isGroup?: boolean;
  isLast?: boolean;
}

export default function MessageBox({ message, className }: MessageBoxProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser();
        setUser(res);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [message.sender.id]);

  const renderContent = () => {
    switch (message.type_message) {
      case MessageType.IMAGE:
        const imageSource = message.image?.url ;

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
                  alt={`${message.sender.name}'s image`}
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
                      alt={`${message.sender.name}'s image (full size)`}
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
        const audioSource = message.audio?.url ;
        const proxyUrl = `/api/audio?url=${encodeURIComponent(audioSource!)}`;
        return (
          audioSource && (
            <audio
              controls
              src={proxyUrl}
              className={className}
              onError={(e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
                const target = e.target as HTMLAudioElement;
                console.log("Erreur avec proxy:", target.error);
              }}
              onLoadStart={() => console.log("Début chargement via proxy")}
            >
              Votre navigateur ne supporte pas la lecture audio.
            </audio>
          )
        );
      case MessageType.FILE:
        const fileSource = message.fichier?.url ;

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

        // Determine file type based on extension or content type
        const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";

        // Get file icon and styling based on extension
        let IconComponent = File; // Default icon
        let fileType = "Fichier";
        let bgColor = "bg-gray-100";
        let iconColor = "text-gray-500";

        if (
          /pdf/.test(fileExtension) ||
          fileSource?.includes("application/pdf")
        ) {
          IconComponent = File;
          fileType = "PDF";
          bgColor = "bg-red-50";
          iconColor = "text-red-500";
        } else if (
          /doc|docx/.test(fileExtension) ||
          fileSource?.includes("word")
        ) {
          IconComponent = FileText;
          fileType = "Word";
          bgColor = "bg-blue-50";
          iconColor = "text-blue-500";
        } else if (
          /xls|xlsx|csv/.test(fileExtension) ||
          fileSource?.includes("spreadsheet") ||
          fileSource?.includes("excel")
        ) {
          IconComponent = FileSpreadsheet;
          fileType = "Excel";
          bgColor = "bg-green-50";
          iconColor = "text-green-500";
        } else if (
          /jpg|jpeg|png|gif|webp|svg/.test(fileExtension) ||
          fileSource?.includes("image/")
        ) {
          IconComponent = FileImage;
          fileType = "Image";
          bgColor = "bg-purple-50";
          iconColor = "text-purple-500";
        } else if (
          /mp3|wav|ogg|m4a/.test(fileExtension) ||
          fileSource?.includes("audio/")
        ) {
          IconComponent = FileAudio;
          fileType = "Audio";
          bgColor = "bg-yellow-50";
          iconColor = "text-yellow-500";
        }

        return (
          fileSource && (
            <div
              className={`${bgColor} rounded-md overflow-hidden border border-gray-200 max-w-[300px]`}
            >
              <div className="p-4 flex items-center gap-3">
                <div className={`${iconColor} p-2 rounded-md`}>
                  <IconComponent size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{fileName}</p>
                  <p className="text-xs text-gray-500">{fileType}</p>
                </div>
              </div>
              <div className="bg-white border-t border-gray-200 p-2 flex justify-end gap-2">
                <a
                  href={fileSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-md hover:bg-gray-100 text-gray-600"
                  title="Ouvrir"
                >
                  <ExternalLink size={16} />
                </a>
                <a
                  href={fileSource}
                  download={fileName}
                  className="p-1 rounded-md hover:bg-gray-100 text-gray-600"
                  title="Télécharger"
                >
                  <Download size={16} />
                </a>
              </div>
            </div>
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
                } min-w-[100px] break-all max-w-[280px] xs:max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg`}
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
                  src={message.image?.url || ""}
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
                      src={message.image?.url || ""}
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
                ? "rounded-b-[8px] rounded-tl-[8px]"
                : "rounded-b-[8px] rounded-tr-[8px]"
            } min-w-[100px] break-all max-w-[280px] xs:max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg`}
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
        src={
          message.sender.id === user?.id && user.image
            ? user.image
            : "/userProfile-img.png"
        }
        alt={message.sender.name}
        width={30}
        height={30}
        className="rounded-full w-[30px] h-[30px]"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">
            {message.sender.name || message.sender.email}
          </span>
        </div>
        <div className="relative w-fit">
          {renderContent()}
          <span className="text-sm text-gray-500 absolute right-0 -bottom-6 text-nowrap">
            {formatDistanceToNow(message.timestamp, {
              locale: fr,
              addSuffix: true,
            })}
          </span>
          {/*<Ellipsis size={18} className="absolute top-1 -right-6" />*/}
        </div>
      </div>
    </div>
  );
}
