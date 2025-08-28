import { Routes } from '@angular/router';
import { AuthGuard, EmailVerificationGuard, NoAuthGuard } from './guards/auth.guard';
import { AccountComponent } from './pages/account/account.component';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';
import { LandingComponent } from './pages/landing/landing.component';
import { SigninComponent } from './pages/signin/signin.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NotAllowedComponent } from './pages/not-allowed/not-allowed.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { EditComponent } from './pages/edit/edit.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { AnimesComponent } from './pages/animes/animes.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    title: `otaku | landing`
  },
  {
    path: 'animes',
    component: AnimesComponent,
    title: 'otaku | landing',
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
    path: 'account/notifications',
    canActivate: [AuthGuard],
    component: NotificationsComponent,
    title: 'otaku | notifications'
  },
  {
    path: 'account/settings',
    canActivate: [AuthGuard],
    component: SettingsComponent,
    title: 'otaku | settings'
  },
  {
    path: 'account/edit',
    canActivate: [AuthGuard],
    component: EditComponent,
    title: 'otaku | edition'
  },
  {
    path: 'account/ranking',
    canActivate: [AuthGuard],
    component: RankingComponent,
    title: 'otaku | ranking'
  },
  {
    path: 'email-verification',
    canActivate: [AuthGuard, EmailVerificationGuard],
    component: EmailVerificationComponent,
    title: 'otaku | email verification'
  },
  {
    path: 'missing-permissions',
    canActivate: [NoAuthGuard],
    component: NotAllowedComponent,
    title: "otaku | missing permissions"
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'otaku | 404'
  }
];

// Commits to be made
/**
 * 1- Customize user genres selections
 * 2- Create the settings page UI
 * 3- Add every functionnalities
 * 4- Add FireBase Transaction for more safety
 * 5- Update firebase security rules on docs
 * 6- Implements the complete
 */