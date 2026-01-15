import { Routes } from '@angular/router';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { Accueil } from './components/accueil/accueil';
import { AuthGuard } from './guard/auth-guard';
import { DashboadHotel } from './components/dashboad-hotel/dashboad-hotel';

export const routes: Routes = [
  {
    path: '',
    component: Accueil
  },
  {
    path: 'accueil',
    component: Accueil
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'dashboard',
    component: DashboadHotel,
    canActivate: [AuthGuard]
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: '**',
    redirectTo: '/accueil'
  }
];
