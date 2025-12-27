import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AnimesListComponent } from '../../components/animes-list/animes-list.component';
import { Anime } from '../../models/anime';
import { AnimeService } from '../../services/anime.service';

@Component({
    selector: 'app-landing',
    imports: [AnimesListComponent, TranslateModule],
    templateUrl: './animes.component.html',
})
export class AnimesComponent {
  protected animes:Anime[] | null = null;
  protected skeletons: undefined[] = Array(20).fill(undefined);

  constructor(
    protected anime: AnimeService
  ) {
  }

  async ngOnInit(): Promise<void> {
    const animes = await this.anime.getTopAnimes();
    this.animes = animes;
  }
}
