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
import path from 'path';
import { AnimeComponent } from './pages/anime/anime.component';
import { MyListComponent } from './pages/my-list/my-list.component';
import { QuestsComponent } from './pages/quests/quests.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    title: `Otaku | Landing`
  },
  {
    path: 'animes',
    component: AnimesComponent,
    title: 'Otaku | Animes',
  },
  {
    path: 'animes/:id',
    component: AnimeComponent,
    title: 'Otaku | Anime'
  },
  {
    path: 'my-list',
    canActivate: [AuthGuard],
    component: MyListComponent,
    title: 'Otaku | My Animes List'
  },
  {
    path: 'quests',
    canActivate: [AuthGuard],
    component: QuestsComponent,
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
    component: AccountComponent,
    title: 'Otaku | Account'
  },
  {
    path: 'account/notifications',
    canActivate: [AuthGuard],
    component: NotificationsComponent,
    title: 'Otaku | Notifications'
  },
  {
    path: 'account/settings',
    canActivate: [AuthGuard],
    component: SettingsComponent,
    title: 'Otaku | Settings'
  },
  {
    path: 'account/edit',
    canActivate: [AuthGuard],
    component: EditComponent,
    title: 'Otaku | Edition'
  },
  {
    path: 'account/ranking',
    canActivate: [AuthGuard],
    component: RankingComponent,
    title: 'Otaku | Ranking'
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