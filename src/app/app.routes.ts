import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { SigninComponent } from './pages/signin/signin.component';
import { AccountComponent } from './pages/account/account.component';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';

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
  {
    path: 'account',
    component: AccountComponent,
    title: 'otaku | account'
  },
  {
    path: 'email-verification',
    component: EmailVerificationComponent,
    title: 'otaku | email verification'
  }
];