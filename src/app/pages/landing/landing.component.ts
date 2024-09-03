import { Component, OnInit } from '@angular/core';
import AuthService from '../../services/auth.service';
import { ToastComponent } from "../../components/toast/toast.component";
import { AnimeService } from '../../services/anime.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [ToastComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
  constructor(
    protected auth: AuthService,
    protected anime: AnimeService
  ) {
  }

  async ngOnInit(): Promise<void> {
    const anime = await this.anime.getAnimeById(1);
    const animes = await this.anime.getRandomAnimes(4);


    console.log("Anime fetched in OnInit : ", anime);
    console.log("Randomly fetched animes : ", animes);
  }

}
