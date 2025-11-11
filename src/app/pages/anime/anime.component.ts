import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimeService } from '../../services/anime.service';
import { Anime } from '../../models/anime';
import AuthService from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { UserData } from '../../models/user';

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
  protected favoriteGenres: string[] = [];
  protected forbiddenGenres: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private animeService: AnimeService,
    private user: UserService
  ) {}

  async ngOnInit() {
    try {
      this.animeId = this.route.snapshot.params['id'];
      this.anime = await this.animeService.getAnimeById(this.animeId);
      const currentUser = await this.user.fetchUserData();

      this.favoriteGenres = currentUser?.favoriteGenres || [];
      this.forbiddenGenres = currentUser?.params?.forbiddenGenres || [];
      console.log("Anime fetched : ", this.anime);
    } catch {

    }

  }
}
