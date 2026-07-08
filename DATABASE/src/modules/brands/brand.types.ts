export interface CreateBrandDto {
  name: string;
  logo?: string;
  website?: string;
  description?: string;
}

export interface UpdateBrandDto {
  name?: string;
  logo?: string;
  website?: string;
  description?: string;
}
