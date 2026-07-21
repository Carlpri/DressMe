export interface CreateMediaInput {
  filename: string;
  url: string;
  altText?: string;
  folder?: string;
  mimeType?: string;
  size?: number;
  createdBy?: string;
}
