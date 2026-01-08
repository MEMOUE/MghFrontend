import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { ApiResponse } from './auth.service';

export interface ChambreDto {
  id?: number;
  numero: string;
  type: string;
  prixParNuit: number;
  capacite: number;
  superficie: number;
  description?: string;
  statut: string;
  etage: number;
  wifi?: boolean;
  climatisation?: boolean;
  television?: boolean;
  minibar?: boolean;
  coffre?: boolean;
  balcon?: boolean;
  vueMer?: boolean;
  hotelId?: number;
  hotelName?: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DisponibiliteChambreRequest {
  dateArrivee: string;
  dateDepart: string;
  typeChambre?: string;
  nombrePersonnes?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChambreService {
  private apiUrl = `${environment.apiUrl}/chambres`;

  constructor(private http: HttpClient) {}

  createChambre(chambre: ChambreDto): Observable<ApiResponse<ChambreDto>> {
    return this.http.post<ApiResponse<ChambreDto>>(this.apiUrl, chambre);
  }

  getChambre(id: number): Observable<ApiResponse<ChambreDto>> {
    return this.http.get<ApiResponse<ChambreDto>>(`${this.apiUrl}/${id}`);
  }

  getAllChambres(): Observable<ApiResponse<ChambreDto[]>> {
    return this.http.get<ApiResponse<ChambreDto[]>>(this.apiUrl);
  }

  getChambresByStatut(statut: string): Observable<ApiResponse<ChambreDto[]>> {
    return this.http.get<ApiResponse<ChambreDto[]>>(`${this.apiUrl}/statut/${statut}`);
  }

  getChambresByType(type: string): Observable<ApiResponse<ChambreDto[]>> {
    return this.http.get<ApiResponse<ChambreDto[]>>(`${this.apiUrl}/type/${type}`);
  }

  searchChambres(keyword: string): Observable<ApiResponse<ChambreDto[]>> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<ApiResponse<ChambreDto[]>>(`${this.apiUrl}/search`, { params });
  }

  getChambresDisponibles(request: DisponibiliteChambreRequest): Observable<ApiResponse<ChambreDto[]>> {
    return this.http.post<ApiResponse<ChambreDto[]>>(`${this.apiUrl}/disponibilite`, request);
  }

  updateChambre(id: number, chambre: ChambreDto): Observable<ApiResponse<ChambreDto>> {
    return this.http.put<ApiResponse<ChambreDto>>(`${this.apiUrl}/${id}`, chambre);
  }

  updateStatut(id: number, statut: string): Observable<ApiResponse<void>> {
    const params = new HttpParams().set('statut', statut);
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}/statut`, null, { params });
  }

  deleteChambre(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
