import { Component, Input } from '@angular/core';
import { Anime } from '../../models/anime';

@Component({
  selector: 'app-anime-card',
  standalone: true,
  imports: [],
  templateUrl: './anime-card.component.html',
  styleUrl: './anime-card.component.scss'
})
export class AnimeCardComponent {
  @Input() anime!: Anime;
}
