import { Routes } from '@angular/router';
import { AuthGuard, EmailVerificationGuard, NoAuthGuard } from './core/guards/auth.guard';
import { AnimesComponent } from './features/animes/pages/animes/animes.component';
import { SigninComponent } from './pages/signin/signin.component';
import { EmailVerificationComponent } from './shared/pages/email-verification/email-verification.component';
import { NotAllowedComponent } from './shared/pages/not-allowed/not-allowed.component';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    // component: LandingComponent,
    component: AnimesComponent,
    title: `Otaku | Landing`
  },
  {
    path: 'animes',
    loadChildren: () => import("./features/animes/animes.route"),
    title: 'Otaku | Animes',
  },
  {
    path: 'quests',
    canActivate: [AuthGuard],
    loadChildren: () => import("./features/quests/quests.route"),
    title: 'Otaku | Quests'
  },
  {
    path: 'sign-in',
    canActivate: [NoAuthGuard],
    component: SigninComponent,
    title: 'Otaku | Authentication'
  },
  {
    path: 'account',
    canActivate: [AuthGuard],
    loadChildren: () => import("./features/account/account.routes"),
    title: 'Otaku | Account'
  },
  {
    path: 'email-verification',
    canActivate: [AuthGuard, EmailVerificationGuard],
    component: EmailVerificationComponent,
    title: 'Otaku | Email verification'
  },
  {
    path: 'missing-permissions',
    canActivate: [NoAuthGuard],
    component: NotAllowedComponent,
    title: "Otaku | Missing permissions"
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Otaku | 404'
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