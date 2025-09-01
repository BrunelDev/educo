"use server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.SCALEWAY_REGION!,
  endpoint: `https://s3.${process.env.SCALEWAY_REGION}.scw.cloud`,
  credentials: {
    accessKeyId: process.env.SCALEWAY_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SCALEWAY_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(files: File[]): Promise<string[]> {
  if (!files || files.length === 0) return [];

  const uploadPromises = files.map(async (file) => {
    const fileKey = `web-impact-cse/${Date.now()}-${file.name}`;

    try {
      // Convert File to ArrayBuffer
      const fileBuffer = await file.arrayBuffer();

      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.SCALEWAY_BUCKET_NAME!,
          Key: fileKey,
          Body: Buffer.from(fileBuffer), // Convert ArrayBuffer to Buffer
          ContentType: file.type,
        })
      );
      const url = `https://${process.env.SCALEWAY_BUCKET_NAME}.s3.${process.env.SCALEWAY_REGION}.scw.cloud/${fileKey}`;
      //encode url
      const encodedUrl = encodeURI(url);
      return encodedUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  });

  return Promise.all(uploadPromises);
}
