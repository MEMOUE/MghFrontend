import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessageModule } from 'primeng/message';
import { AuthService, LoginRequest } from '../../../services/auth.service';

interface AccountTypeOption {
  label: string;
  value: 'HOTEL' | 'USER';
  icon: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    SelectButtonModule,
    MessageModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  accountType: 'HOTEL' | 'USER' = 'HOTEL';
  loading = signal(false);
  error = signal<string | null>(null);

  accountTypeOptions: AccountTypeOption[] = [
    { label: 'Hôtel', value: 'HOTEL', icon: 'pi pi-building' },
    { label: 'Employé', value: 'USER', icon: 'pi pi-user' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error.set('Veuillez remplir tous les champs');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const credentials: LoginRequest = {
      email: this.email,
      password: this.password,
      accountType: this.accountType
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.error.set(response.message || 'Erreur de connexion');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur de connexion:', err);
        this.error.set(err.error?.message || 'Email ou mot de passe incorrect');
        this.loading.set(false);
      }
    });
  }
}
