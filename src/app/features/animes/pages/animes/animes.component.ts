import { Component, OnInit } from '@angular/core';
import { Anime } from '../../models/anime';
import AuthService from '../../../../core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { AnimesListComponent } from '../../components/animes-list/animes-list.component';
import { AnimeService } from '../../services/anime.service';

@Component({
    selector: 'app-landing',
    imports: [AnimesListComponent, TranslateModule],
    templateUrl: './animes.component.html',
    styleUrl: './animes.component.scss'
})
export class AnimesComponent {
  protected animes:Anime[] | null = null;
  protected skeletons: undefined[] = Array(20).fill(undefined);

  constructor(
    protected auth: AuthService,
    protected anime: AnimeService
  ) {
  }

  async ngOnInit(): Promise<void> {
    const animes = await this.anime.getTopAnimes();
    this.animes = animes;

    console.log("Randomly fetched animes : ", animes);
  }
}
