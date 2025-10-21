import { Component, Input } from '@angular/core';
import { Anime } from '../../models/anime';
import { AnimeCardComponent } from '../anime-card/anime-card.component';

@Component({
  selector: 'app-animes-list',
  standalone: true,
  imports: [AnimeCardComponent],
  templateUrl: './animes-list.component.html',
  styleUrl: './animes-list.component.scss'
})
export class AnimesListComponent {
  @Input() animes!: Anime[];
}
