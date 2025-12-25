import { Routes } from '@angular/router';
import { AuthGuard, EmailVerificationGuard, NoAuthGuard } from './core/guards/auth.guard';
import { AnimesComponent } from './features/animes/pages/animes/animes.component';
import { EditComponent } from './features/account/pages/edit/edit.component';
import { MyListComponent } from './features/animes/pages/my-list/my-list.component';
import { NotAllowedComponent } from './shared/pages/not-allowed/not-allowed.component';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';
import { QuestsComponent } from './features/quests/pages/quests/quests.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { SigninComponent } from './pages/signin/signin.component';
import { AnimeComponent } from './features/animes/pages/anime/anime.component';
import { AccountComponent } from './features/account/pages/account/account.component';
import { NotificationsComponent } from './features/account/pages/notifications/notifications.component';
import { SettingsComponent } from './features/account/pages/settings/settings.component';
import { GamesHistoryComponent } from './features/account/pages/games-history/games-history.component';
import { EmailVerificationComponent } from './shared/pages/email-verification/email-verification.component';

export const routes: Routes = [
  {
    path: '',
    // component: LandingComponent,
    component: AnimesComponent,
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
    path: 'account/games-history',
    canActivate: [AuthGuard],
    component: GamesHistoryComponent,
    title: 'Otaku | Xp History'
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