import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { Produit, MouvementStock, Fournisseur, TypeMouvement } from '../models/stock.model';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private produitsUrl = `${environment.apiUrl}/produits`;

  constructor(private http: HttpClient) {}

  // ========== PRODUITS ==========

  // Créer un produit
  createProduit(produit: Produit): Observable<ApiResponse<Produit>> {
    return this.http.post<ApiResponse<Produit>>(this.produitsUrl, produit);
  }

  // Obtenir tous les produits
  getProduits(): Observable<ApiResponse<Produit[]>> {
    return this.http.get<ApiResponse<Produit[]>>(this.produitsUrl);
  }

  // Obtenir un produit par ID
  getProduitById(id: number): Observable<ApiResponse<Produit>> {
    return this.http.get<ApiResponse<Produit>>(`${this.produitsUrl}/${id}`);
  }

  // Obtenir les produits en rupture de stock
  getProduitsEnRupture(): Observable<ApiResponse<Produit[]>> {
    return this.http.get<ApiResponse<Produit[]>>(`${this.produitsUrl}/rupture`);
  }

  // Mettre à jour un produit
  updateProduit(id: number, produit: Partial<Produit>): Observable<ApiResponse<Produit>> {
    return this.http.put<ApiResponse<Produit>>(`${this.produitsUrl}/${id}`, produit);
  }

  // Supprimer un produit
  deleteProduit(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.produitsUrl}/${id}`);
  }

  // Ajuster le stock d'un produit
  ajusterStock(
    produitId: number,
    quantite: number,
    type: TypeMouvement,
    motif?: string
  ): Observable<ApiResponse<void>> {
    let params = new HttpParams()
      .set('quantite', quantite.toString())
      .set('type', type);
    
    if (motif) {
      params = params.set('motif', motif);
    }

    return this.http.post<ApiResponse<void>>(
      `${this.produitsUrl}/${produitId}/ajuster-stock`,
      {},
      { params }
    );
  }
}