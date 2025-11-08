import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Anime } from '../../models/anime';
import { AnimeService } from '../../services/anime.service';
import { UserData } from '../../models/user';
import { AnimesListComponent } from '../../components/animes-list/animes-list.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-my-list',
  standalone: true,
  imports: [AnimesListComponent, TranslateModule],
  templateUrl: './my-list.component.html',
  styleUrl: './my-list.component.scss'
})
export class MyListComponent implements OnInit {
  animes: Anime[] | null = null;
  currentUser!:UserData;
  protected skeletons: undefined[] = Array(10).fill(undefined);

  constructor(
    private user: UserService,
    private anime: AnimeService
  ) {}

  async ngOnInit() {
    this.currentUser = await this.user.fetchUserData();

    this.animes = await Promise.all(
      [...this.currentUser.animeListIds.map(async (id) => await this.anime.getAnimeById(id))]
    )
  }
}
