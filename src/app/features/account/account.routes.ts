import { Routes } from "@angular/router";

export default [
  {
    path: '',
    loadComponent: () => import("./pages/account/account.component")
      .then(m => m.AccountComponent)
  },
  {
    path: 'edit',
    loadComponent: () => import("./pages/edit/edit.component")
      .then(m => m.EditComponent)
  },
  {
    path: 'notifications',
    loadComponent: () => import("./pages/notifications/notifications.component")
      .then(m => m.NotificationsComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import("./pages/settings/settings.component")
      .then(m => m.SettingsComponent)
  },
  {
    path: 'games-history',
    loadComponent: () => import("./pages/games-history/games-history.component")
      .then(m => m.GamesHistoryComponent)
  },
  {
    path: 'ranking',
    loadComponent: () => import("./pages/ranking/ranking.component")
      .then(m => m.RankingComponent)
  }
] satisfies Routes;