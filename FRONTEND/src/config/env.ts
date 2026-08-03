const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error("VITE_API_URL must be configured.");
}

export const env = {
  apiUrl: apiUrl.replace(/\/$/, ""),
  mode: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  cloudinaryCloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? "",
  cloudinaryUploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ?? "",
} as const;
