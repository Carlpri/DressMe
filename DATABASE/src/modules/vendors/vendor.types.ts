export interface CreateVendorDto {
  userId?: string; // Admin can specify userId to create vendor for another user
  businessName: string;
  whatsappNumber: string;
  address: string;
  location: string;
  phoneNumber?: string;
  email?: string;         // Prisma column name
  city?: string;
  county?: string;
  town?: string;
  contactPerson?: string;
  logo?: string;
  description?: string;
  coverImage?: string;
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
  phoneNumber?: string;
  email?: string;         // Prisma column name
  city?: string;
  county?: string;
  town?: string;
  contactPerson?: string;
  logo?: string;
  description?: string;
  coverImage?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  website?: string;
}
