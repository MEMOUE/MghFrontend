import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  routerLink?: string;
  command?: () => void;
  separator?: boolean;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  protected readonly hotelName = signal('Grand Hotel Palace');
  protected readonly userName = signal('Marie Dubois');
  protected readonly userRole = signal('Gestionnaire');
  protected readonly notificationCount = computed(() =>
    this.notifications().filter(n => !n.read).length
  );

  // États des dropdowns
  showNotifications = false;
  showUserMenu = false;
  showMobileMenu = false;

  // Gestion du mode sombre
  protected readonly isDarkMode = signal(false);

  constructor() {
    // Charger la préférence depuis localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    this.isDarkMode.set(isDark);
    this.applyTheme(isDark);
  }

  protected readonly mainMenuItems: MenuItem[] = [
    { label: 'Tableau de bord', icon: 'pi pi-home', routerLink: '/dashboard' },
    { label: 'Réservations', icon: 'pi pi-calendar', routerLink: '/reservations' },
    { label: 'Chambres', icon: 'pi pi-building', routerLink: '/rooms' },
    { label: 'Clients', icon: 'pi pi-users', routerLink: '/clients' },
    { label: 'Rapports', icon: 'pi pi-chart-bar', routerLink: '/reports' }
  ];

  protected readonly userMenuItems: MenuItem[] = [
    {
      label: 'Mon profil',
      icon: 'pi pi-user',
      command: () => this.goToProfile()
    },
    {
      label: 'Paramètres',
      icon: 'pi pi-cog',
      command: () => this.goToSettings()
    },
    {
      label: '',
      icon: '',
      separator: true
    },
    {
      label: 'Aide',
      icon: 'pi pi-question-circle',
      command: () => this.openHelp()
    },
    {
      label: '',
      icon: '',
      separator: true
    },
    {
      label: 'Déconnexion',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  protected readonly notifications = signal<Notification[]>([
    {
      id: 1,
      title: 'Nouvelle réservation',
      message: 'Suite présidentielle réservée pour 3 nuits',
      time: 'Il y a 2 minutes',
      read: false
    },
    {
      id: 2,
      title: 'Check-in en attente',
      message: 'M. Smith - Chambre 205',
      time: 'Il y a 15 minutes',
      read: false
    },
    {
      id: 3,
      title: 'Maintenance terminée',
      message: 'Chambre 101 est maintenant disponible',
      time: 'Il y a 1 heure',
      read: true
    },
    {
      id: 4,
      title: 'Paiement reçu',
      message: 'Réservation #12345 - 450€',
      time: 'Il y a 2 heures',
      read: false
    },
    {
      id: 5,
      title: 'Avis client',
      message: 'Nouveau commentaire 5 étoiles',
      time: 'Il y a 3 heures',
      read: true
    }
  ]);

  toggleSearch(): void {
    console.log('Toggle search');
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  toggleTheme(): void {
    const newValue = !this.isDarkMode();
    this.isDarkMode.set(newValue);
    this.applyTheme(newValue);
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  closeAllDropdowns(): void {
    this.showNotifications = false;
    this.showUserMenu = false;
  }

  markAsRead(notificationId: number): void {
    const notifications = this.notifications();
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      this.notifications.set([...notifications]);
    }
  }

  clearAllNotifications(): void {
    const notifications = this.notifications();
    notifications.forEach(n => n.read = true);
    this.notifications.set([...notifications]);
    this.showNotifications = false;
  }

  goToProfile(): void {
    console.log('Navigation vers le profil');
    this.closeAllDropdowns();
  }

  goToSettings(): void {
    console.log('Navigation vers les paramètres');
    this.closeAllDropdowns();
  }

  openHelp(): void {
    console.log('Ouverture de l\'aide');
    this.closeAllDropdowns();
  }

  logout(): void {
    console.log('Déconnexion');
    this.closeAllDropdowns();
  }
}
