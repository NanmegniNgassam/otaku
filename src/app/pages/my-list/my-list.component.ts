import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Anime } from '../../models/anime';
import { AnimeService } from '../../services/anime.service';
import { UserData } from '../../models/user';

@Component({
  selector: 'app-my-list',
  standalone: true,
  imports: [],
  templateUrl: './my-list.component.html',
  styleUrl: './my-list.component.scss'
})
export class MyListComponent implements OnInit {
  animes: Anime[] = [];
  currentUser!:UserData;

  constructor(
    private user: UserService,
    private anime: AnimeService
  ) {}

  async ngOnInit() {
    this.currentUser = await this.user.fetchUserData();
    console.log("Liked animes : ", this.currentUser.animeListIds);
  }
}
