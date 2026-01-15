import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../src/environment/environment';
import { Chambre, ChambreFilter } from '../models/hotel.model';

@Injectable({
  providedIn: 'root'
})
export class ChambreService {
  private apiUrl = `${environment.apiUrl}/api/chambres`;
  private chambresSubject = new BehaviorSubject<Chambre[]>([]);
  public chambres$ = this.chambresSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les chambres avec filtres optionnels
   */
  getChambres(filters?: ChambreFilter): Observable<Chambre[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.hotel) params = params.set('hotel', filters.hotel.toString());
      if (filters.type_chambre) params = params.set('type_chambre', filters.type_chambre);
      if (filters.etage !== undefined) params = params.set('etage', filters.etage.toString());
      if (filters.capacite_adultes) params = params.set('capacite_adultes', filters.capacite_adultes.toString());
      if (filters.prix_min) params = params.set('prix_min', filters.prix_min.toString());
      if (filters.prix_max) params = params.set('prix_max', filters.prix_max.toString());
      if (filters.disponible !== undefined) params = params.set('disponible', filters.disponible.toString());
      if (filters.date_debut) params = params.set('date_debut', filters.date_debut.toISOString().split('T')[0]);
      if (filters.date_fin) params = params.set('date_fin', filters.date_fin.toISOString().split('T')[0]);
    }

    return this.http.get<Chambre[]>(this.apiUrl + '/', { params }).pipe(
      tap(chambres => this.chambresSubject.next(chambres)),
      catchError(this.handleError)
    );
  }

  /**
   * Récupère une chambre par son ID
   */
  getChambre(id: number): Observable<Chambre> {
    return this.http.get<Chambre>(`${this.apiUrl}/${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère les chambres d'un hôtel spécifique
   */
  getChambresByHotel(hotelId: number): Observable<Chambre[]> {
    return this.getChambres({ hotel: hotelId });
  }

  /**
   * Récupère les chambres disponibles pour des dates données
   */
  getChambresDisponibles(hotelId: number, dateDebut: Date, dateFin: Date): Observable<Chambre[]> {
    return this.getChambres({
      hotel: hotelId,
      date_debut: dateDebut,
      date_fin: dateFin,
      disponible: true
    });
  }

  /**
   * Crée une nouvelle chambre
   */
  createChambre(chambre: Chambre): Observable<Chambre> {
    return this.http.post<Chambre>(this.apiUrl + '/', chambre).pipe(
      tap(newChambre => {
        const currentChambres = this.chambresSubject.value;
        this.chambresSubject.next([...currentChambres, newChambre]);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Met à jour une chambre existante
   */
  updateChambre(id: number, chambre: Partial<Chambre>): Observable<Chambre> {
    return this.http.patch<Chambre>(`${this.apiUrl}/${id}/`, chambre).pipe(
      tap(updatedChambre => {
        const currentChambres = this.chambresSubject.value;
        const index = currentChambres.findIndex(c => c.id === id);
        if (index !== -1) {
          currentChambres[index] = updatedChambre;
          this.chambresSubject.next([...currentChambres]);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Supprime une chambre
   */
  deleteChambre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`).pipe(
      tap(() => {
        const currentChambres = this.chambresSubject.value;
        this.chambresSubject.next(currentChambres.filter(c => c.id !== id));
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Upload d'images pour une chambre
   */
  uploadImages(id: number, files: File[]): Observable<Chambre> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`image_${index}`, file);
    });

    return this.http.post<Chambre>(`${this.apiUrl}/${id}/upload-images/`, formData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Change la disponibilité d'une chambre
   */
  toggleDisponibilite(id: number, disponible: boolean): Observable<Chambre> {
    return this.updateChambre(id, { disponible });
  }

  /**
   * Recherche de chambres par critères
   */
  searchChambres(
    hotelId: number,
    typesChambre: string[],
    capaciteAdultes: number,
    prixMax?: number
  ): Observable<Chambre[]> {
    let params = new HttpParams()
      .set('hotel', hotelId.toString())
      .set('capacite_adultes', capaciteAdultes.toString());

    if (typesChambre.length > 0) {
      params = params.set('types', typesChambre.join(','));
    }

    if (prixMax) {
      params = params.set('prix_max', prixMax.toString());
    }

    return this.http.get<Chambre[]>(`${this.apiUrl}/search/`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Vérifie la disponibilité d'une chambre pour des dates données
   */
  checkDisponibilite(chambreId: number, dateDebut: Date, dateFin: Date): Observable<boolean> {
    const params = new HttpParams()
      .set('date_debut', dateDebut.toISOString().split('T')[0])
      .set('date_fin', dateFin.toISOString().split('T')[0]);

    return this.http.get<{ disponible: boolean }>(`${this.apiUrl}/${chambreId}/check-disponibilite/`, { params }).pipe(
      map(response => response.disponible),
      catchError(this.handleError)
    );
  }

  /**
   * Récupère le prix d'une chambre pour une période donnée
   */
  calculatePrix(chambreId: number, dateDebut: Date, dateFin: Date): Observable<number> {
    const params = new HttpParams()
      .set('date_debut', dateDebut.toISOString().split('T')[0])
      .set('date_fin', dateFin.toISOString().split('T')[0]);

    return this.http.get<{ prix_total: number }>(`${this.apiUrl}/${chambreId}/calculate-prix/`, { params }).pipe(
      map(response => response.prix_total),
      catchError(this.handleError)
    );
  }

  /**
   * Gestion des erreurs HTTP
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;

      if (error.error) {
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error.detail) {
          errorMessage = error.error.detail;
        } else if (error.error.message) {
          errorMessage = error.error.message;
        }
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
