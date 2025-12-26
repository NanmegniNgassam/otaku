import { Routes } from "@angular/router";
import { AuthGuard } from "../../core/guards/auth.guard";

export default [
  {
    path: '',
    loadComponent: () => import("./pages/animes/animes.component")
      .then(m => m.AnimesComponent),
  },
  {
    path: 'my-list',
    canActivate: [AuthGuard],
    loadComponent: () => import("./pages/my-list/my-list.component")
      .then(m => m.MyListComponent),
    title: "Otaku | My animes List"
  },
  {
    path: ':id',
    loadComponent: () => import("./pages/anime/anime.component")
      .then(m => m.AnimeComponent),
    title: "Otaku | Anime"
  }
] satisfies Routes;