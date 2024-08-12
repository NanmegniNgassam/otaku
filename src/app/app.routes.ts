import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { SigninComponent } from './pages/signin/signin.component';
import { Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    title: `otaku | landing`
  },
  {
    path: 'sign-in',
    component: SigninComponent,
    title: 'otaku | authentication'
  },
];