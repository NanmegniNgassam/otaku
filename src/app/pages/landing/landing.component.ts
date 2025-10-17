import { Component, OnInit } from '@angular/core';
import { AnimeService } from '../../services/anime.service';
import AuthService from '../../services/auth.service';
import { Anime } from '../../models/anime';
import { AnimeCardComponent } from '../../components/anime-card/anime-card.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [AnimeCardComponent],
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
    const animes = await this.anime.getRandomAnimes(4);
    this.animes = animes;

    console.log("Randomly fetched animes : ", animes);
  }

}
