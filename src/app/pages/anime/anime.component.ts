import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimeService } from '../../services/anime.service';
import { Anime } from '../../models/anime';

@Component({
  selector: 'app-anime',
  standalone: true,
  imports: [],
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.scss'
})
export class AnimeComponent implements OnInit {
  protected animeId!: number;
  protected anime!: Anime;

  constructor(
    private route: ActivatedRoute,
    private animeService: AnimeService
  ) { }

  async ngOnInit() {
    this.animeId = this.route.snapshot.params['id'];
    this.anime = await this.animeService.getAnimeById(this.animeId);

    console.log("Anime fetched : ", this.anime);
  }
}
