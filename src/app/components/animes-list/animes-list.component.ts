import { Component, Input, OnInit } from '@angular/core';
import { Anime } from '../../models/anime';
import { AnimeCardComponent } from '../anime-card/anime-card.component';
import { AnimeSkeletonComponent } from '../anime-skeleton/anime-skeleton.component';
import { UserData } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-animes-list',
  standalone: true,
  imports: [AnimeCardComponent, AnimeSkeletonComponent],
  templateUrl: './animes-list.component.html',
  styleUrl: './animes-list.component.scss'
})
export class AnimesListComponent implements OnInit {
  @Input() animes!: Anime[] | undefined[];
  currentUserDoc!: UserData;
  followedAnimes!: number[];

  constructor(private userService: UserService) {}

  async ngOnInit() {
    this.currentUserDoc = await this.userService.fetchUserData();
    this.followedAnimes = this.currentUserDoc.animeListIds || [];
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

    // Save changes on firestore
    await this.userService.updateUserDoc({ animeListIds: this.followedAnimes });
  }
}
