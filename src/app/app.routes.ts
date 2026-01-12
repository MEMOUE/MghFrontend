import { Routes } from '@angular/router';
import { Login } from './components/auth/login/login';
import {Accueil} from './components/accueil/accueil';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', component: Accueil }
];
