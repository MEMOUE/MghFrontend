import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';

import { MessageService, ConfirmationService } from 'primeng/api';

import { StockService } from '../../../services/stock.service';
import { Produit, TypeMouvement, TYPE_MOUVEMENT_LABELS } from '../../../models/stock.model';

interface Statistics {
  totalProduits: number;
  produitsEnRupture: number;
  valeurTotaleStock: number;
  produitsAlerte: number;
}

@Component({
  selector: 'app-listestock',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    CardModule,
    ToolbarModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    InputNumberModule,
    SelectModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './listestock.html',
  styleUrl: './listestock.css'
})
export class Listestock implements OnInit {
  produits: Produit[] = [];
  filteredProduits: Produit[] = [];
  loading = false;
  searchValue = '';

  // Statistiques
  statistics: Statistics = {
    totalProduits: 0,
    produitsEnRupture: 0,
    valeurTotaleStock: 0,
    produitsAlerte: 0
  };

  // Dialog ajustement stock
  displayAjustementDialog = false;
  selectedProduit?: Produit;
  ajustementQuantite: number = 0;
  ajustementType: TypeMouvement = TypeMouvement.ENTREE;
  ajustementMotif: string = '';

  typesAjustement = [
    { value: TypeMouvement.ENTREE, label: TYPE_MOUVEMENT_LABELS[TypeMouvement.ENTREE] },
    { value: TypeMouvement.SORTIE, label: TYPE_MOUVEMENT_LABELS[TypeMouvement.SORTIE] },
    { value: TypeMouvement.AJUSTEMENT, label: TYPE_MOUVEMENT_LABELS[TypeMouvement.AJUSTEMENT] },
    { value: TypeMouvement.RETOUR, label: TYPE_MOUVEMENT_LABELS[TypeMouvement.RETOUR] }
  ];

  // Pagination
  rows = 10;
  rowsPerPageOptions = [10, 20, 50];

  constructor(
    private stockService: StockService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadProduits();
  }

  loadProduits() {
    this.loading = true;
    this.stockService.getProduits().subscribe({
      next: (response) => {
        if (response.success) {
          this.produits = response.data;
          this.filteredProduits = [...this.produits];
          this.calculateStatistics();
        }
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.message || 'Erreur lors du chargement des produits'
        });
        this.loading = false;
      }
    });
  }

  calculateStatistics() {
    this.statistics.totalProduits = this.produits.length;
    
    this.statistics.produitsEnRupture = this.produits.filter(
      p => p.quantiteStock === 0
    ).length;
    
    this.statistics.produitsAlerte = this.produits.filter(
      p => p.seuilAlerte && p.quantiteStock <= p.seuilAlerte && p.quantiteStock > 0
    ).length;
    
    this.statistics.valeurTotaleStock = this.produits.reduce(
      (sum, p) => sum + (p.quantiteStock * p.prixUnitaire),
      0
    );
  }

  onSearch() {
    if (!this.searchValue.trim()) {
      this.filteredProduits = [...this.produits];
      return;
    }

    const searchLower = this.searchValue.toLowerCase();
    this.filteredProduits = this.produits.filter(p =>
      p.nom.toLowerCase().includes(searchLower) ||
      p.code.toLowerCase().includes(searchLower) ||
      p.fournisseurNom?.toLowerCase().includes(searchLower)
    );
  }

  clearSearch() {
    this.searchValue = '';
    this.onSearch();
  }

  getStockSeverity(produit: Produit): string {
    if (produit.quantiteStock === 0) {
      return 'danger';
    }
    if (produit.seuilAlerte && produit.quantiteStock <= produit.seuilAlerte) {
      return 'warning';
    }
    return 'success';
  }

  getStockLabel(produit: Produit): string {
    if (produit.quantiteStock === 0) {
      return 'Rupture';
    }
    if (produit.seuilAlerte && produit.quantiteStock <= produit.seuilAlerte) {
      return 'Alerte';
    }
    return 'Disponible';
  }

  showAjustementDialog(produit: Produit) {
    this.selectedProduit = produit;
    this.ajustementQuantite = 0;
    this.ajustementType = TypeMouvement.ENTREE;
    this.ajustementMotif = '';
    this.displayAjustementDialog = true;
  }

  ajusterStock() {
    if (!this.selectedProduit || this.ajustementQuantite <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez saisir une quantité valide'
      });
      return;
    }

    this.stockService.ajusterStock(
      this.selectedProduit.id!,
      this.ajustementQuantite,
      this.ajustementType,
      this.ajustementMotif
    ).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Stock ajusté avec succès'
        });
        this.displayAjustementDialog = false;
        this.loadProduits();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.message || 'Erreur lors de l\'ajustement du stock'
        });
      }
    });
  }

  voirDetail(id: number) {
    this.router.navigate(['/stocks', id]);
  }

  modifier(id: number) {
    this.router.navigate(['/stocks', id, 'edit']);
  }

  supprimer(produit: Produit) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le produit "${produit.nom}" ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: () => {
        this.stockService.deleteProduit(produit.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Produit supprimé avec succès'
            });
            this.loadProduits();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: error.message || 'Erreur lors de la suppression'
            });
          }
        });
      }
    });
  }

  nouveauProduit() {
    this.router.navigate(['/stocks/create']);
  }

  actualiser() {
    this.loadProduits();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value) + ' FCFA';
  }
}