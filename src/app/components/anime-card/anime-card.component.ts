import { Component, Input, OnInit } from '@angular/core';
import { Anime, AnimeGenre } from '../../models/anime';

@Component({
  selector: 'app-anime-card',
  standalone: true,
  imports: [],
  templateUrl: './anime-card.component.html',
  styleUrl: './anime-card.component.scss'
})
export class AnimeCardComponent implements OnInit {
  @Input() anime!: Anime;
  genresAndThemes: AnimeGenre[] = []; 

  ngOnInit() {
    this.genresAndThemes = this.anime.genres.concat(this.anime.themes);
  }
}
