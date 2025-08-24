import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    MenubarModule,
    AvatarModule,
    BadgeModule,
    InputTextModule,
    RippleModule,
    ButtonModule,
    MenuModule,
    DividerModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  protected readonly hotelName = signal('Grand Hotel Palace');
  protected readonly userName = signal('Marie Dubois');
  protected readonly userRole = signal('Gestionnaire');
  protected readonly notificationCount = signal(5);

  // État pour le dropdown de notifications
  notificationDropdownVisible = false;
  userDropdownVisible = false;

  protected readonly menuItems: MenuItem[] = [
    {
      label: 'Tableau de Bord',
      icon: 'pi pi-home',
      routerLink: '/dashboard'
    },
    {
      label: 'Réservations',
      icon: 'pi pi-calendar',
      items: [
        {
          label: 'Nouvelle Réservation',
          icon: 'pi pi-plus',
          routerLink: '/reservations/new'
        },
        {
          label: 'Liste des Réservations',
          icon: 'pi pi-list',
          routerLink: '/reservations'
        },
        {
          label: 'Check-in / Check-out',
          icon: 'pi pi-sign-in',
          routerLink: '/reservations/checkin'
        }
      ]
    },
    {
      label: 'Chambres',
      icon: 'pi pi-building',
      items: [
        {
          label: 'Gestion des Chambres',
          icon: 'pi pi-cog',
          routerLink: '/rooms'
        },
        {
          label: 'État des Chambres',
          icon: 'pi pi-eye',
          routerLink: '/rooms/status'
        },
        {
          label: 'Maintenance',
          icon: 'pi pi-wrench',
          routerLink: '/rooms/maintenance'
        }
      ]
    },
    {
      label: 'Clients',
      icon: 'pi pi-users',
      items: [
        {
          label: 'Liste des Clients',
          icon: 'pi pi-list',
          routerLink: '/clients'
        },
        {
          label: 'Nouveau Client',
          icon: 'pi pi-user-plus',
          routerLink: '/clients/new'
        },
        {
          label: 'Programme Fidélité',
          icon: 'pi pi-heart',
          routerLink: '/clients/loyalty'
        }
      ]
    },
    {
      label: 'Finances',
      icon: 'pi pi-euro',
      items: [
        {
          label: 'Facturation',
          icon: 'pi pi-file-export',
          routerLink: '/billing'
        },
        {
          label: 'Paiements',
          icon: 'pi pi-credit-card',
          routerLink: '/payments'
        },
        {
          label: 'Rapports Financiers',
          icon: 'pi pi-chart-line',
          routerLink: '/reports/financial'
        }
      ]
    },
    {
      label: 'Rapports',
      icon: 'pi pi-chart-bar',
      items: [
        {
          label: 'Taux d\'Occupation',
          icon: 'pi pi-percentage',
          routerLink: '/reports/occupancy'
        },
        {
          label: 'Revenus',
          icon: 'pi pi-dollar',
          routerLink: '/reports/revenue'
        },
        {
          label: 'Analyse Client',
          icon: 'pi pi-users',
          routerLink: '/reports/clients'
        }
      ]
    }
  ];

  protected readonly userMenuItems: MenuItem[] = [
    {
      label: 'Mon Profil',
      icon: 'pi pi-user',
      command: () => this.goToProfile()
    },
    {
      label: 'Paramètres de l\'Hôtel',
      icon: 'pi pi-cog',
      command: () => this.goToSettings()
    },
    {
      separator: true
    },
    {
      label: 'Aide & Support',
      icon: 'pi pi-question-circle',
      command: () => this.openSupport()
    },
    {
      separator: true
    },
    {
      label: 'Déconnexion',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  protected readonly notifications = signal([
    {
      id: 1,
      title: 'Nouvelle réservation',
      message: 'Réservation pour la suite présidentielle',
      time: 'Il y a 2 minutes',
      read: false
    },
    {
      id: 2,
      title: 'Check-in en attente',
      message: 'Client Smith - Chambre 205',
      time: 'Il y a 15 minutes',
      read: false
    },
    {
      id: 3,
      title: 'Maintenance terminée',
      message: 'Chambre 101 disponible',
      time: 'Il y a 1 heure',
      read: true
    }
  ]);

  toggleNotificationDropdown(): void {
    this.notificationDropdownVisible = !this.notificationDropdownVisible;
    this.userDropdownVisible = false; // Fermer l'autre dropdown
  }

  toggleUserDropdown(): void {
    this.userDropdownVisible = !this.userDropdownVisible;
    this.notificationDropdownVisible = false; // Fermer l'autre dropdown
  }

  goToProfile(event?: any): void {
    console.log('Navigation vers le profil');
    this.userDropdownVisible = false;
  }

  goToSettings(event?: any): void {
    console.log('Navigation vers les paramètres');
    this.userDropdownVisible = false;
  }

  openSupport(event?: any): void {
    console.log('Ouverture du support');
    this.userDropdownVisible = false;
  }

  logout(event?: any): void {
    console.log('Déconnexion');
    this.userDropdownVisible = false;
  }

  markAsRead(notificationId: number): void {
    const notifications = this.notifications();
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifications.set([...notifications]);
      // Réduire le compteur
      if (this.notificationCount() > 0) {
        this.notificationCount.set(this.notificationCount() - 1);
      }
    }
  }

  clearAllNotifications(): void {
    this.notifications.set([]);
    this.notificationCount.set(0);
    this.notificationDropdownVisible = false;
  }
}
