// properties-types.ts

import { Observable } from 'rxjs';

export interface PropertyServiceInterface {
  create(data: CreateProperty): Observable<PropertyResponse>;
  getPropertyById(data: PropertyById): Observable<GetPropertyByIdResponse>;
  getAllProperties(data: Empty): Observable<PropertiesListResponse>;
  updateProperty(data: UpdateProperty): Observable<GetPropertyByIdResponse>;
  deleteProperty(data: PropertyById): Observable<DeletePropertyResponse>;
}

export interface PropertyById {
  id: string;
}

export interface CreateProperty {
  title: string;
  description: string;
  address: string;
  propertyType: string;
  size: number;
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  hostId: number;
}

export interface Property {
  title: string;
  description: string;
  address: string;
  propertyType: string;
  size: number;
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  hostId: number;
}

export interface PropertyResponse {
  id: string;
  title?: string;
  address?: string;
  error: boolean;
  message: string;
}

export interface GetPropertyByIdResponse {
  id: string;
  title: string;
  description: string;
  address: string;
  propertyType: string;
  size: number;
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  hostId: number;
  error: boolean;
  message: string;
}

export interface Empty {}

export interface PropertiesListResponse {
  error: boolean;
  message: string;
  properties: Property[];
}

export interface UpdateProperty {
  id: string;
  title: string;
  description: string;
  address: string;
  propertyType: string;
  size: number;
  bedrooms: number;
  bathrooms: number;
  capacity: number;
}

export interface DeletePropertyResponse {
  error: boolean;
  message: string;
}
