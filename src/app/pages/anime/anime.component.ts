import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-anime',
  standalone: true,
  imports: [],
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.scss'
})
export class AnimeComponent implements OnInit {
  protected animeId!: number;
  constructor(
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.animeId = this.route.snapshot.params['id'];
  }
}
