export interface AttributeDto {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
}

export interface AttributeValueDto {
  id: string;
  attributeId: string;
  value: string;
  slug: string;
}

export interface ColorDto {
  id: string;
  name: string;
  hexCode?: string;
  isActive: boolean;
  displayOrder: number;
}

export interface SizeDto {
  id: string;
  name: string;
  category: string;
  displayOrder: number;
}

export interface LocationDto {
  id: string;
  location: string;
  city?: string;
  county?: string;
}
