import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, Routes } from "@angular/router";
import { AuthGuard } from "../../core/guards/auth.guard";
import { UserService } from "../../services/user.service";
import { AnimeService } from "./services/anime.service";

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
    title: "Otaku | My animes List",
    resolve: {
      animes: async () => {
        const animeService = inject(AnimeService);
        const userData = await inject(UserService).fetchUserData();
        const animes = await animeService.getAnimeByIds(userData.animeListIds);

        return animes;
      } 
    }
  },
  {
    path: ':id',
    loadComponent: () => import("./pages/anime/anime.component")
      .then(m => m.AnimeComponent),
    title: "Otaku | Anime",
    resolve: {
      anime: (route: ActivatedRouteSnapshot) => inject(AnimeService).getAnimeObservableById(route.params['id']),
      currentUser: () => inject(UserService).fetchUserData(),
    } 
  }
] satisfies Routes;