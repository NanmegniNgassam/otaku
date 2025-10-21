import { Component, OnInit } from '@angular/core';
import { AnimesListComponent } from '../../components/animes-list/animes-list.component';
import { Anime } from '../../models/anime';
import { AnimeService } from '../../services/anime.service';
import AuthService from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [AnimesListComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
  protected animes:Anime[] = [];

  constructor(
    protected auth: AuthService,
    protected anime: AnimeService
  ) {
  }

  async ngOnInit(): Promise<void> {
    const animes = await this.anime.getRandomAnimes(12);
    this.animes = animes;

    console.log("Randomly fetched animes : ", animes);
  }

}
