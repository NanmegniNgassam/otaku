import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { SigninComponent } from './pages/signin/signin.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    title: 'landing'
  },
  {
    path: 'sign-in',
    component: SigninComponent,
    title: 'authentication'
  },
];
