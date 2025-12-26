import { Component, CUSTOM_ELEMENTS_SCHEMA, input, OnInit } from '@angular/core';
import { UserData } from '../../../../models/user';
import { UserService } from '../../../../services/user.service';
import { Anime } from '../../models/anime';

@Component({
    selector: 'app-anime',
    imports: [],
    templateUrl: './anime.component.html',
    styleUrl: './anime.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AnimeComponent implements OnInit {
  followedAnimes: number[] = [];
  isFollowed: boolean = false;
  anime = input.required<Anime>();
  currentUser = input<UserData>();

  constructor(
    private userService: UserService
  ) {}

  async ngOnInit() {
    try {
      this.followedAnimes = this.currentUser()?.animeListIds || [];
      this.isFollowed = this.followedAnimes.includes(this.anime().mal_id);
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
