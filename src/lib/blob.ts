import { put } from "@vercel/blob";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 25 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

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

  if (file.size <= 0) {
    throw new Error("File is empty.");
  }

  if (isImage) {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      throw new Error("Unsupported image type.");
    }
    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error("Image is too large (max 10MB).");
    }
  }

  if (isVideo) {
    if (!ALLOWED_VIDEO_TYPES.has(file.type)) {
      throw new Error("Unsupported video type.");
    }
    if (file.size > MAX_VIDEO_BYTES) {
      throw new Error("Video is too large (max 25MB).");
    }
  }

  const blob = await put(`uploads/${Date.now()}-${safeFilename(file.name)}`, file, {
    access: "public",
    token,
  });

  return blob.url;
}
