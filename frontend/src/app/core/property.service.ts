import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  transactionType: 'SALE' | 'RENT';
  propertyType: 'APARTMENT' | 'HOUSE' | 'COMMERCIAL' | 'LAND' | 'OTHER';
  areaM2?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  active: boolean;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
  version: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/properties`;

  search(params: {
    city?: string;
    transactionType?: string;
    propertyType?: string;
    page?: number;
    size?: number;
  } = {}): Observable<Page<Property>> {
    let httpParams = new HttpParams();
    if (params.city) httpParams = httpParams.set('city', params.city);
    if (params.transactionType) httpParams = httpParams.set('transactionType', params.transactionType);
    if (params.propertyType) httpParams = httpParams.set('propertyType', params.propertyType);
    if (params.page != null) httpParams = httpParams.set('page', params.page);
    if (params.size != null) httpParams = httpParams.set('size', params.size);

    return this.http.get<Page<Property>>(this.baseUrl, { params: httpParams });
  }

  findById(id: string): Observable<Property> {
    return this.http.get<Property>(`${this.baseUrl}/${id}`);
  }
}
