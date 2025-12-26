import { Component, CUSTOM_ELEMENTS_SCHEMA, input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { Anime } from '../../models/anime';
import { AnimeService } from '../../services/anime.service';

@Component({
    selector: 'app-anime',
    imports: [],
    templateUrl: './anime.component.html',
    styleUrl: './anime.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AnimeComponent implements OnInit {
  protected animeId!: number;
  protected favoriteGenres: string[] = [];
  protected forbiddenGenres: string[] = [];
  followedAnimes: number[] = [];
  isFollowed: boolean = false;
  anime = input.required<Anime>();

  constructor(
    private route: ActivatedRoute,
    private animeService: AnimeService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    try {
      this.animeId = +this.route.snapshot.params['id'];
      const currentUser = await this.userService.fetchUserData();

      this.followedAnimes = currentUser.animeListIds || [];
      this.isFollowed = this.followedAnimes.includes(this.animeId);
      this.favoriteGenres = currentUser?.favoriteGenres || [];
      this.forbiddenGenres = currentUser?.params?.forbiddenGenres || [];
    } catch {
    }
  }

  /**
   * Add or remove a specific anime on the user followed animes list
   * 
   * @param animeId animeId subject to modifications
   */
  async toggleAnimeFollowing(animeId: number) {
    if (this.followedAnimes.includes(animeId))
      this.followedAnimes = [...new Set(this.followedAnimes.filter((id) => id !== animeId))];
    else 
      this.followedAnimes = [...new Set([...this.followedAnimes, animeId])];

    this.isFollowed = this.followedAnimes.includes(animeId);
    // Save changes on firestore
    await this.userService.updateUserDoc({ animeListIds: this.followedAnimes });
  }
}
