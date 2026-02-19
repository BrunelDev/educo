"use server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with service role key for server-side uploads
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false },
  }
);

const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME || "educo-prod-storage";

/**
 * Upload files to Supabase Storage
 * Function name kept as "uploadToS3" for backward compatibility
 * @param files - Array of File objects to upload
 * @returns Promise<string[]> - Array of public URLs for uploaded files
 */
export async function uploadToS3(files: File[]): Promise<string[]> {
  if (!files || files.length === 0) return [];

  const uploadPromises = files.map(async (file) => {
    const fileKey = `web-educo/${Date.now()}-${file.name}`;

    try {
      // Convert File to ArrayBuffer
      const fileBuffer = await file.arrayBuffer();

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileKey, fileBuffer, {
          contentType: file.type,
          upsert: false, // Don't overwrite existing files
        });

      if (error) throw error;

      // Get public URL for the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileKey);

      // Encode URL to handle special characters
      return publicUrl;
    } catch (error) {
console.error(error)
      ;
      throw error;
    }
  });

  return Promise.all(uploadPromises);
}
