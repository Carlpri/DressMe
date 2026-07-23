const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export const env = {
  apiUrl: apiUrl.replace(/\/$/, ""),
  mode: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  cloudinaryCloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? "mrjdesh0",
  cloudinaryUploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ?? "dressme-products",
} as const;
