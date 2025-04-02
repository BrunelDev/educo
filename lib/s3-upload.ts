import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(files: File[]): Promise<string[]> {
  if (!files || files.length === 0) return [];

  const uploadPromises = files.map(async (file) => {
    const fileKey = `public/${Date.now()}-${file.name}`;

    try {
      // Convert File to ArrayBuffer
      const fileBuffer = await file.arrayBuffer();

      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
          Key: fileKey,
          Body: Buffer.from(fileBuffer), // Convert ArrayBuffer to Buffer
          ContentType: file.type,
        })
      );

      return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileKey}`;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  });

  return Promise.all(uploadPromises);
}
