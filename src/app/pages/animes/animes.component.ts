import { Component, OnInit } from '@angular/core';
import { AnimesListComponent } from '../../components/animes-list/animes-list.component';
import { Anime } from '../../models/anime';
import { AnimeService } from '../../services/anime.service';
import AuthService from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [AnimesListComponent],
  templateUrl: './animes.component.html',
  styleUrl: './animes.component.scss'
})
export class AnimesComponent {
  protected animes:Anime[] | null = null;
  protected skeletons: undefined[] = Array(18).fill(undefined);

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
