import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Services et modèles
import { ChambreService } from '../../../services/chambre.service';
import { AuthService } from '../../../services/auth.service';
import {
  Chambre,
  TypeChambre,
  StatutChambre,
  TYPE_CHAMBRE_LABELS,
  STATUT_CHAMBRE_LABELS,
  EQUIPEMENTS_CHAMBRE
} from '../../../models/hotel.model';

@Component({
  selector: 'app-form-chambre',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    MultiSelectModule,
    CheckboxModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './form-chambre.html'
})
export class FormChambre implements OnInit, OnDestroy {
  chambreForm!: FormGroup;
  isEditMode = false;
  loading = false;
  submitting = false;
  errorMessage = '';
  chambreId: number | null = null;
  hotelId: number | null = null;

  // Options pour les dropdowns
  typesChambres: any[] = [];
  statuts: any[] = [];
  etages: any[] = [];
  equipementsDisponibles: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private chambreService: ChambreService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadHotelId();
    this.initializeOptions();
    this.initializeForm();
    this.checkEditMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadHotelId(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser?.hotelId) {
      this.hotelId = currentUser.hotelId;
    } else {
      this.showError('Erreur', 'Aucun hôtel associé à votre compte');
      this.router.navigate(['/dashboard']);
    }
  }

  private initializeOptions(): void {
    // Types de chambres
    this.typesChambres = Object.entries(TYPE_CHAMBRE_LABELS).map(([value, label]) => ({
      label,
      value
    }));

    // Statuts
    this.statuts = Object.entries(STATUT_CHAMBRE_LABELS).map(([value, label]) => ({
      label,
      value
    }));

    // Étages
    this.etages = Array.from({ length: 11 }, (_, i) => ({
      label: i === 0 ? 'Rez-de-chaussée' : `Étage ${i}`,
      value: i
    }));

    // Équipements
    this.equipementsDisponibles = EQUIPEMENTS_CHAMBRE.map((equipement: string) => ({
      label: equipement,
      value: equipement
    }));
  }

  private initializeForm(): void {
    this.chambreForm = this.formBuilder.group({
      numero: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      typeChambre: [TypeChambre.SIMPLE, Validators.required],
      etage: [0, Validators.required],
      capaciteAdultes: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      capaciteEnfants: [0, [Validators.min(0), Validators.max(10)]],
      superficie: [null, [Validators.min(0)]],
      prixParNuit: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      equipements: [[]],
      disponible: [true],
      statut: [StatutChambre.DISPONIBLE, Validators.required],
      notes: ['']
    });
  }

  private checkEditMode(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.chambreId = +id;
        this.loadChambre(this.chambreId);
      }
    });
  }

  private loadChambre(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.chambreService.getChambre(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (chambre) => {
          this.populateForm(chambre);
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement de la chambre:', error);
          this.errorMessage = 'Impossible de charger la chambre';
          this.showError('Erreur', this.errorMessage);
          this.loading = false;
        }
      });
  }

  private populateForm(chambre: Chambre): void {
    this.chambreForm.patchValue({
      numero: chambre.numero,
      typeChambre: chambre.type_chambre,
      etage: chambre.etage,
      capaciteAdultes: chambre.capacite_adultes,
      capaciteEnfants: chambre.capacite_enfants,
      superficie: chambre.superficie,
      prixParNuit: chambre.prix_nuit,
      description: chambre.description,
      equipements: chambre.equipements || [],
      disponible: chambre.disponible,
      statut: chambre.etat,
      notes: chambre.notes
    });
  }

  onSubmit(): void {
    if (this.chambreForm.invalid) {
      this.markFormGroupTouched(this.chambreForm);
      this.showError('Formulaire invalide', 'Veuillez corriger les erreurs avant de soumettre');
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    const formValue = this.chambreForm.value;
    const chambreData: Chambre = {
      hotel: this.hotelId!,
      numero: formValue.numero,
      type_chambre: formValue.typeChambre,
      etage: formValue.etage,
      capacite_adultes: formValue.capaciteAdultes,
      capacite_enfants: formValue.capaciteEnfants,
      superficie: formValue.superficie,
      prix_nuit: formValue.prixParNuit,
      description: formValue.description,
      equipements: formValue.equipements || [],
      disponible: formValue.disponible,
      etat: formValue.statut,
      notes: formValue.notes
    };

    const request$ = this.isEditMode
      ? this.chambreService.updateChambre(this.chambreId!, chambreData)
      : this.chambreService.createChambre(chambreData);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (chambre) => {
        const message = this.isEditMode
          ? 'Chambre modifiée avec succès'
          : 'Chambre créée avec succès';

        this.showSuccess('Succès', message);
        this.submitting = false;

        // Redirection après un court délai
        setTimeout(() => {
          this.router.navigate(['/chambres']);
        }, 1500);
      },
      error: (error) => {
        console.error('Erreur lors de la sauvegarde:', error);

        let errorMsg = 'Une erreur est survenue lors de la sauvegarde';
        if (error.error?.message) {
          errorMsg = error.error.message;
        } else if (error.error?.numero) {
          errorMsg = 'Ce numéro de chambre existe déjà';
        }

        this.errorMessage = errorMsg;
        this.showError('Erreur de sauvegarde', errorMsg);
        this.submitting = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.chambreForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const control = this.chambreForm.get(fieldName);

    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      return 'Ce champ est obligatoire';
    }
    if (control.errors['min']) {
      return `La valeur minimale est ${control.errors['min'].min}`;
    }
    if (control.errors['max']) {
      return `La valeur maximale est ${control.errors['max'].max}`;
    }
    if (control.errors['minlength']) {
      return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
    }
    if (control.errors['maxlength']) {
      return `Maximum ${control.errors['maxlength'].requiredLength} caractères`;
    }

    return 'Valeur invalide';
  }

  goBack(): void {
    this.location.back();
  }

  private showSuccess(summary: string, detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life: 3000
    });
  }

  private showError(summary: string, detail: string): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life: 5000
    });
  }
}
