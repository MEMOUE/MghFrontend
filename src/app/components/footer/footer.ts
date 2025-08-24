import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-footer',
  imports: [
    CommonModule,
    ButtonModule,
    DividerModule,
    TooltipModule
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  protected readonly currentYear = signal(new Date().getFullYear());
  protected readonly version = signal('v2.1.4');
  protected readonly lastUpdate = signal('Dernière mise à jour: 15 Août 2025');

  protected readonly quickLinks = signal([
    { label: 'Centre d\'aide', icon: 'pi pi-question-circle', action: () => this.openHelp() },
    { label: 'Documentation', icon: 'pi pi-book', action: () => this.openDocs() },
    { label: 'Support Technique', icon: 'pi pi-phone', action: () => this.openSupport() },
    { label: 'Formations', icon: 'pi pi-graduation-cap', action: () => this.openTraining() }
  ]);

  protected readonly legalLinks = signal([
    { label: 'Conditions d\'utilisation', action: () => this.openTerms() },
    { label: 'Politique de confidentialité', action: () => this.openPrivacy() },
    { label: 'RGPD', action: () => this.openGDPR() },
    { label: 'Mentions légales', action: () => this.openLegal() }
  ]);

  protected readonly socialLinks = signal([
    {
      label: 'LinkedIn',
      icon: 'pi pi-linkedin',
      url: 'https://linkedin.com',
      tooltip: 'Suivez-nous sur LinkedIn'
    },
    {
      label: 'Twitter',
      icon: 'pi pi-twitter',
      url: 'https://twitter.com',
      tooltip: 'Suivez-nous sur Twitter'
    },
    {
      label: 'Facebook',
      icon: 'pi pi-facebook',
      url: 'https://facebook.com',
      tooltip: 'Suivez-nous sur Facebook'
    },
    {
      label: 'YouTube',
      icon: 'pi pi-youtube',
      url: 'https://youtube.com',
      tooltip: 'Chaîne YouTube officielle'
    }
  ]);

  openHelp(): void {
    console.log('Ouverture du centre d\'aide');
    // Logique pour ouvrir le centre d'aide
  }

  openDocs(): void {
    console.log('Ouverture de la documentation');
    // Logique pour ouvrir la documentation
  }

  openSupport(): void {
    console.log('Ouverture du support technique');
    // Logique pour ouvrir le support technique
  }

  openTraining(): void {
    console.log('Ouverture des formations');
    // Logique pour ouvrir les formations
  }

  openTerms(): void {
    console.log('Ouverture des conditions d\'utilisation');
    // Logique pour ouvrir les CGU
  }

  openPrivacy(): void {
    console.log('Ouverture de la politique de confidentialité');
    // Logique pour ouvrir la politique de confidentialité
  }

  openGDPR(): void {
    console.log('Ouverture des informations RGPD');
    // Logique pour ouvrir les informations RGPD
  }

  openLegal(): void {
    console.log('Ouverture des mentions légales');
    // Logique pour ouvrir les mentions légales
  }

  openSocialLink(url: string): void {
    window.open(url, '_blank');
  }
}
