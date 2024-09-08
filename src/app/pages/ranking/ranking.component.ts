import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { UserData } from '../../models/user';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RankingComponent implements OnInit {
  _isSearching = false;
  _ranking!: any;
  _userData!:  UserData;
  

  constructor(
    private user: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    this._ranking = await this.user.getRanking();
    this._userData = await this.user.fetchUserData();

    if(this._userData.position === null) {
      this._userData.position = 0;
    }
  }

  onSearch(searchValue: string) {
    if(!searchValue)
      return;

    this._isSearching = true;
  }

}
