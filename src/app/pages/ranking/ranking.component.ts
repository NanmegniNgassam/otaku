import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TimeCounter } from '../../models/others';
import { Ranking, UserData } from '../../models/user';
import { UserService } from '../../services/user.service';

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
  _ranking!: Ranking[];
  _stableRanking!: Ranking[];
  _userData!:  UserData;
  _searchForm!: FormGroup;
  _playerNotFoundMessage!: string;
  _lastRankingUpdate!: string;
  _agoraDownCounter!: TimeCounter;
  
  constructor(
    private user: UserService,
    private formBuilder: FormBuilder,
    private translate: TranslateService
  ) {
    this._agoraDownCounter = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }

    // Initialize the search bar
    this._searchForm = this.formBuilder.group({
      searchValue: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    }, {
      updateOn: 'change'
    })

    // Listening to search value changes & handle players searches
    this._searchForm.valueChanges.subscribe(() => {
      const searchValue: string = this._searchForm.value.searchValue;
      
      this._ranking = this.searchPlayers(searchValue.trim());
    })
  }

  /**
   * Performs some actions right after the constructor
   */
  async ngOnInit(): Promise<void> {
    // Fetch user data
    this._userData = await this.user.fetchUserData();
    if(this._userData.position === null) {
      this._userData.position = 0;
    }

    // Get the last ranking update Date
    const lastUpdateDate = await this.user.getLastRankingUpdateDate()
    this._lastRankingUpdate = lastUpdateDate.toLocaleDateString();

    // Set the next ranking day
    const nextAgoraDay = this.user.getNextRankingUpdateDate();

    setInterval(() => {
      this._agoraDownCounter =  this.generateDownCount(nextAgoraDay, new Date());
    }, 1*1000)

    // Get all the ranking 
    this._ranking = await this.user.getRanking();
    this._stableRanking = this._ranking;
  }

  /**
   * format the player name on 20 characters to fit the available size
   * 
   * @param playerName the name of the shown player
   * @returns a standardized format of the playername
   */
  formatPlayerName(playerName: string): string {
    const formattedName = playerName.slice(0,20) + (playerName.length > 20 ? '...': '')

    return formattedName;
  }

  /**
   * generate a TimeCounter object ( @link TimeCounter) with { days, hours, minutes and secondes}
   * 
   * @param end the day when timer goes off
   * @param start the day when timer 'starts'
   * 
   * @returns a (@link TimeCounter) Object
   */
  generateDownCount(end: Date, start=new Date()) : TimeCounter {
    let remainingTime = (end.valueOf() - start.valueOf()) / 1000;

    // Processing the remaining time stats
    const days = Math.floor(remainingTime / (24 * 60 * 60));
    remainingTime %= (24 * 60 * 60); 

    const hours = Math.floor(remainingTime  / (60 * 60))
    remainingTime %= (60 * 60);

    const minutes = Math.floor(remainingTime / 60)
    remainingTime %= 60

    const seconds = Math.floor(remainingTime)

    
    return {
      days, hours, minutes, seconds
    }
  }

  /**
   * Filter players according to search criteria
   * 
   * @param searchValue the string value entered in the search bar
   * @returns a list of players matching the search
   */
  searchPlayers(searchValue: string) : Ranking[] {
    let filteredRanking: Ranking[] = [];

    if( searchValue.length >= 3 ) {
      this._isSearching = true;
      filteredRanking = this._stableRanking.filter((player: Ranking) => 
        player.playerName.toLowerCase().includes(searchValue.toLowerCase())
      )

      if(!filteredRanking.length) {
        this.translate.get("pages.ranking.userNotFound", { player : searchValue }).subscribe((text: string) => {
          this._playerNotFoundMessage = text;
        })
      }
    } else {
      this._isSearching = false;
      filteredRanking = this._stableRanking;
    }

    return filteredRanking;
  }

  /**
   * Empty the search field to reinitialize the search
   */
  emptySearchField() {
    this._searchForm.setValue({searchValue : ""})
  }
}
