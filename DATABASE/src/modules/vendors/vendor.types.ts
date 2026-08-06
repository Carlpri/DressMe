export interface CreateVendorDto {
  userId?: string; // Admin can specify userId to create vendor for another user
  shopName: string;
  phone: string;
  address: string;
  location: string;
  logo?: string;
  description?: string;
  coverImage?: string;
  businessEmail?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  website?: string;
}

export interface UpdateVendorDto {
  businessName?: string;
  whatsappNumber?: string;
  address?: string;
  location?: string;
  logo?: string;
  description?: string;
  coverImage?: string;
  businessEmail?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  website?: string;
}
