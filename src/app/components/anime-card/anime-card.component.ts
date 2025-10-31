import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { Anime, AnimeGenre } from '../../models/anime';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-anime-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './anime-card.component.html',
  styleUrl: './anime-card.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AnimeCardComponent implements OnInit {
  @Input() anime!: Anime;
  genresAndThemes: AnimeGenre[] = [];
  @Input() isAnimeLiked!:boolean;

  ngOnInit() {
    this.genresAndThemes = this.anime.genres.concat(this.anime.themes);
  }
}
