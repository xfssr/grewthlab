import { put } from "@vercel/blob";

function safeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

export async function uploadAssetToBlob(file: File): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
  }

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  if (!isImage && !isVideo) {
    throw new Error("Only image and video files are supported.");
  }

  const blob = await put(`uploads/${Date.now()}-${safeFilename(file.name)}`, file, {
    access: "public",
    token,
  });

  return blob.url;
}
