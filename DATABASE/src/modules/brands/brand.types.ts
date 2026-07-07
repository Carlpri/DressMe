export interface CreateBrandDto {
  name: string;
  logo?: string;
}

export interface UpdateBrandDto {
  name?: string;
  logo?: string;
}