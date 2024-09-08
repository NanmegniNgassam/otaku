import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { UserData } from '../../models/user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, ReactiveFormsModule],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RankingComponent implements OnInit {
  _isSearching:boolean = false;
  _ranking!: any[];
  _stableRanking!: any[];
  _userData!:  UserData;
  _searchForm!: FormGroup;
  _userNotFoundMessage!: string;
  

  constructor(
    private user: UserService,
    private formBuilder: FormBuilder,
    private translate: TranslateService
  ) {
    this._searchForm = this.formBuilder.group({
      searchValue: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    }, {
      updateOn: 'change'
    })

    // Listening to search value changes
    this._searchForm.valueChanges.subscribe(() => {
      const searchValue: string = this._searchForm.value.searchValue;
      if( searchValue.length >= 3 ) {
        this._isSearching = true;
        this._ranking = this._stableRanking.filter((rank) => 
          rank.playerName.toLowerCase().includes(searchValue.toLowerCase())
        )
        if(!this._ranking.length) {
          translate.get("pages.ranking.userNotFound", { player : searchValue }).subscribe((text: string) => {
            this._userNotFoundMessage = text;
          })
        }
      } else {
        this._isSearching = false;
        this._ranking = this._stableRanking;
      }
    })
    
  }

  /**
   * Performs some actions right after the constructor
   */
  async ngOnInit(): Promise<void> {
    this._userData = await this.user.fetchUserData();
    if(this._userData.position === null) {
      this._userData.position = 0;
    }

    this._ranking = await this.user.getRanking();
    this._ranking = this._ranking.map((player) => {
      return {
        ...player,
        playerName: player.playerName.slice(0,20) + (player.playerName.length > 20 ? '...': '')
      }
    })
    this._stableRanking = this._ranking;
  }

  /**
   * Empty the search field to reinitialize the search
   */
  emptySearchField() {
    this._searchForm.setValue({searchValue : ""})
  }
}
