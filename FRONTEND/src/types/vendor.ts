export interface Vendor {
  id: string;
  businessName: string;
  whatsappNumber: string;
  address: string;
  location: string;
  phoneNumber?: string;
  email?: string;
  city?: string;
  county?: string;
  town?: string;
  contactPerson?: string;
  slug?: string;
  logo?: string;
  description?: string;
  coverImage?: string;
  businessEmail?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  website?: string;
  isVerified: boolean;
  isActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
