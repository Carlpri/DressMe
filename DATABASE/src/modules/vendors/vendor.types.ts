export interface CreateVendorDto {
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
  shopName?: string;
  phone?: string;
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
