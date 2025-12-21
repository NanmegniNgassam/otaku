import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Anime, AnimeGenre } from '../../models/anime';
import { RouterLink } from "@angular/router";
import { TranslateModule } from '@ngx-translate/core';


@Component({
    selector: 'app-anime-card',
    imports: [RouterLink, TranslateModule],
    templateUrl: './anime-card.component.html',
    styleUrl: './anime-card.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AnimeCardComponent implements OnInit {
  @Input() anime!: Anime;
  genresAndThemes: AnimeGenre[] = [];
  @Input() isFollowed!:boolean;
  @Output() toggle = new EventEmitter<number>();

  ngOnInit() {
    this.genresAndThemes = this.anime.genres.concat(this.anime.themes);
  }

  onToggleFollow() {

  }
}
