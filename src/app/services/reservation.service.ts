import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { ApiResponse } from './auth.service';

export interface ClientDto {
  id?: number;
  prenom: string;
  nom: string;
  email?: string;
  telephone: string;
  pieceIdentite?: string;
  typePiece?: string;
  dateNaissance?: string;
  nationalite?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  notes?: string;
}

export interface CreateReservationRequest {
  chambreId: number;
  clientId?: number;
  newClient?: ClientDto;
  dateArrivee: string;
  dateDepart: string;
  nombreAdultes: number;
  nombreEnfants?: number;
  notes?: string;
  demandesSpeciales?: string;
  montantPaye?: number;
  modePaiement?: string;
  referenceExterne?: string;
}

export interface ReservationDto {
  id?: number;
  numeroReservation?: string;
  chambreId: number;
  chambreNumero?: string;
  clientId: number;
  clientNom?: string;
  clientPrenom?: string;
  clientTelephone?: string;
  hotelId?: number;
  dateArrivee: string;
  dateDepart: string;
  nombreNuits?: number;
  nombreAdultes: number;
  nombreEnfants?: number;
  prixParNuit?: number;
  montantTotal?: number;
  montantPaye?: number;
  montantRestant?: number;
  statut?: string;
  statutPaiement?: string;
  modePaiement?: string;
  notes?: string;
  demandesSpeciales?: string;
  dateCheckin?: string;
  dateCheckout?: string;
  createdById?: number;
  createdByName?: string;
  checkinById?: number;
  checkinByName?: string;
  checkoutById?: number;
  checkoutByName?: string;
  referenceExterne?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = `${environment.apiUrl}/reservations`;

  constructor(private http: HttpClient) {}

  createReservation(request: CreateReservationRequest): Observable<ApiResponse<ReservationDto>> {
    return this.http.post<ApiResponse<ReservationDto>>(this.apiUrl, request);
  }

  getReservation(id: number): Observable<ApiResponse<ReservationDto>> {
    return this.http.get<ApiResponse<ReservationDto>>(`${this.apiUrl}/${id}`);
  }

  getReservationByNumero(numero: string): Observable<ApiResponse<ReservationDto>> {
    return this.http.get<ApiResponse<ReservationDto>>(`${this.apiUrl}/numero/${numero}`);
  }

  getAllReservations(): Observable<ApiResponse<ReservationDto[]>> {
    return this.http.get<ApiResponse<ReservationDto[]>>(this.apiUrl);
  }

  getReservationsByStatut(statut: string): Observable<ApiResponse<ReservationDto[]>> {
    return this.http.get<ApiResponse<ReservationDto[]>>(`${this.apiUrl}/statut/${statut}`);
  }

  getReservationsByClient(clientId: number): Observable<ApiResponse<ReservationDto[]>> {
    return this.http.get<ApiResponse<ReservationDto[]>>(`${this.apiUrl}/client/${clientId}`);
  }

  getArriveesAujourdhui(): Observable<ApiResponse<ReservationDto[]>> {
    return this.http.get<ApiResponse<ReservationDto[]>>(`${this.apiUrl}/arrivees-aujourdhui`);
  }

  getDepartsAujourdhui(): Observable<ApiResponse<ReservationDto[]>> {
    return this.http.get<ApiResponse<ReservationDto[]>>(`${this.apiUrl}/departs-aujourdhui`);
  }

  getReservationsEnCours(): Observable<ApiResponse<ReservationDto[]>> {
    return this.http.get<ApiResponse<ReservationDto[]>>(`${this.apiUrl}/en-cours`);
  }

  getReservationsAVenir(): Observable<ApiResponse<ReservationDto[]>> {
    return this.http.get<ApiResponse<ReservationDto[]>>(`${this.apiUrl}/a-venir`);
  }

  searchReservations(keyword: string): Observable<ApiResponse<ReservationDto[]>> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<ApiResponse<ReservationDto[]>>(`${this.apiUrl}/search`, { params });
  }

  updateReservation(id: number, reservation: ReservationDto): Observable<ApiResponse<ReservationDto>> {
    return this.http.put<ApiResponse<ReservationDto>>(`${this.apiUrl}/${id}`, reservation);
  }

  doCheckin(id: number): Observable<ApiResponse<ReservationDto>> {
    return this.http.post<ApiResponse<ReservationDto>>(`${this.apiUrl}/${id}/checkin`, {});
  }

  doCheckout(id: number): Observable<ApiResponse<ReservationDto>> {
    return this.http.post<ApiResponse<ReservationDto>>(`${this.apiUrl}/${id}/checkout`, {});
  }

  cancelReservation(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  addPaiement(id: number, montant: number, modePaiement: string): Observable<ApiResponse<ReservationDto>> {
    const params = new HttpParams()
      .set('montant', montant.toString())
      .set('modePaiement', modePaiement);
    return this.http.post<ApiResponse<ReservationDto>>(`${this.apiUrl}/${id}/paiement`, null, { params });
  }
}
