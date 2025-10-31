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
  likedAnimes: number[] = [];

  constructor(private userService: UserService) {}

  async ngOnInit() {
    this.currentUserDoc = await this.userService.fetchUserData();
    this.likedAnimes = this.currentUserDoc.animeListIds;
  }
}
