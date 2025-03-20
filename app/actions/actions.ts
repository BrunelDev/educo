"use server";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { nanoid } from "nanoid";

interface UploadResult {
  success: boolean;
  message: string;
  urls?: string[];
}

export const handleFileUpload = async (
  files?: File[]
): Promise<UploadResult> => {
  if (!files || files.length === 0) {
    return {
      success: false,
      message: "No files provided",
    };
  }

  try {
    const client = new S3Client({
      region: process.env.AWS_REGION,
    });

    // Upload all files in parallel
    const uploadPromises = files.map(async (file) => {
      // Get file extension and original name
      const fileExtension = file.name.split(".").pop() || "";
      const originalName = file.name.replace(/\.[^/.]+$/, "");
      const sanitizedName = originalName.replace(/[^a-zA-Z0-9]/g, "-");

      const { url, fields } = await createPresignedPost(client, {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `public/${sanitizedName}-${nanoid()}.${fileExtension}`,
        Expires: 600,
        Conditions: [
          ["content-length-range", 0, 10 * 1024 * 1024], // 10MB limit
          ["starts-with", "$Content-Type", file.type],
        ],
      });

      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("Content-Type", file.type);
      formData.append("file", file);

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const textResponse = await response.text();
        throw new Error(`Failed to upload ${file}: ${textResponse}`);
      }

      return url;
    });

    // Wait for all uploads to complete
    const uploadedUrls = await Promise.all(uploadPromises);
    console.log({
      success: true,
      message: "All files uploaded successfully",
      urls: uploadedUrls,
    });

    return {
      success: true,
      message: "All files uploaded successfully",
      urls: uploadedUrls,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
