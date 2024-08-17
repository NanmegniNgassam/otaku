import { Routes } from '@angular/router';
import { AuthGuard, EmailVerificationGuard, NoAuthGuard } from './guards/auth.guard';
import { AccountComponent } from './pages/account/account.component';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';
import { LandingComponent } from './pages/landing/landing.component';
import { SigninComponent } from './pages/signin/signin.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    title: `otaku | landing`
  },
  {
    path: 'sign-in',
    canActivate: [NoAuthGuard],
    component: SigninComponent,
    title: 'otaku | authentication'
  },
  {
    path: 'account',
    canActivate: [AuthGuard],
    component: AccountComponent,
    title: 'otaku | account'
  },
  {
    path: 'email-verification',
    canActivate: [AuthGuard, EmailVerificationGuard],
    component: EmailVerificationComponent,
    title: 'otaku | email verification'
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'otaku | 404'
  }
];