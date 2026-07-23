import axios from "axios";
import { env } from "../config/env";

export interface CloudinaryUploadResult {
  secure_url: string;
  url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

export interface CloudinaryUploadOptions {
  onProgress?: (progress: number) => void;
  folder?: string;
}

/**
 * Uploads a file directly from the browser to Cloudinary using an unsigned upload preset.
 */
export async function uploadToCloudinary(
  file: File,
  options?: CloudinaryUploadOptions
): Promise<CloudinaryUploadResult> {
  const cloudName = env.cloudinaryCloudName || import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "mrjdesh0";
  const uploadPreset = env.cloudinaryUploadPreset || import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "dressme-products";

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary is not configured. Please ensure VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET are set in your environment variables."
    );
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  if (options?.folder) {
    formData.append("folder", options.folder);
  }

  try {
    const response = await axios.post<CloudinaryUploadResult>(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && options?.onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          options.onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error);
    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      "Failed to upload image to Cloudinary.";
    throw new Error(errorMessage);
  }
}
