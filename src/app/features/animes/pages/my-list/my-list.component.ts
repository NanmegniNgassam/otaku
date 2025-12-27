import { Component, input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UserData } from '../../../../models/user';
import { AnimesListComponent } from '../../components/animes-list/animes-list.component';
import { Anime } from '../../models/anime';
import { AnimeService } from '../../services/anime.service';

@Component({
    selector: 'app-my-list',
    imports: [AnimesListComponent, TranslateModule],
    templateUrl: './my-list.component.html',
    styleUrl: './my-list.component.scss'
})
export class MyListComponent implements OnInit {
  animes: Anime[] | null = null;
  currentUser = input.required<UserData>();
  protected skeletons: undefined[] = Array(10).fill(undefined);

  constructor(
    private anime: AnimeService
  ) {}

  async ngOnInit() {
    const animeIds = [...this.currentUser().animeListIds];
    this.animes = await this.anime.getAnimeByIds(animeIds);
  }
}
