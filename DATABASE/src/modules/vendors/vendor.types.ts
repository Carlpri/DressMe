export interface CreateVendorDto {
  shopName: string;
  phone: string;
  address: string;
  location: string;
  logo?: string;
  description?: string;
}

export interface UpdateVendorDto {
  shopName?: string;
  phone?: string;
  address?: string;
  location?: string;
  logo?: string;
  description?: string;
}