import { Routes } from '@angular/router';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { Accueil } from './components/accueil/accueil';
import { AuthGuard } from './guard/auth-guard';
import { DashboadHotel } from './components/dashboad-hotel/dashboad-hotel';

export const routes: Routes = [
  {
    path: '',
    component: Accueil,
    pathMatch: 'full'
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
    // canActivate: [AuthGuard]
  },
  {
    path: 'chambres',
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./components/chambres/liste-chambre/liste-chambre')
          .then(m => m.ListeChambres)
      },
      {
        path: 'create',
        loadComponent: () => import('./components/chambres/form-chambre/form-chambre')
          .then(m => m.FormChambre)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./components/chambres/form-chambre/form-chambre')
          .then(m => m.FormChambre)
      },
      {
        path: ':id',
        loadComponent: () => import('./components/chambres/detail-chambre/detail-chambre')
          .then(m => m.DetailChambre)
      }
    ]
  },
  { 
    path: 'reservation',
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./components/reservations/listrservation/listrservation')
          .then(m => m.Listrservation)
      },
      {
        path: 'create',
        loadComponent: () => import('./components/reservations/creatrservation/creatrservation')
          .then(m => m.Creatrservation)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./components/reservations/creatrservation/creatrservation')
          .then(m => m.Creatrservation)
      },
      {
        path: ':id',
        loadComponent: () => import('./components/reservations/detail-reservation/detail-reservation')
          .then(m => m.DetailReservation)
      }
    ]
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./components/unauthorized/unauthorized.component')
      .then(m => m.UnauthorizedComponent)
  },
  {
    path: '**',
    redirectTo: '/accueil'
  }
];