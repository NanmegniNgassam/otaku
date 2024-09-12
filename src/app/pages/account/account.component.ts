import { AsyncPipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserData } from '../../models/user';
import AuthService from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ToastComponent } from '../../components/toast/toast.component';
import { Toast } from '../../models/toast';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [AsyncPipe, TranslateModule, ToastComponent, RouterLink],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccountComponent implements OnInit {
  user$ = this.auth.user$;
  STREAK_STEPS = [1, 2, 3, 4, 5, 6, 7]
  _streakDays!: number;
  _notification!: Toast | null;
  _userData: UserData = {
    level: 'f',
    xp: 0,
    quests: 0,
    favoriteGenres: [],
    animeListIds: [],
    streak: [],
    params: {},
    position: 0,
    playerName: this.auth.currentUser?.displayName!,
  }; 

  /**
   * 
   * @param auth auth service
   * @param translate translate service
   * @param user user/db service
   */
  constructor(
    protected auth: AuthService,
    private translate: TranslateService,
    private user: UserService
  ) {}

  /**
   * Performs some general tasks right after construction
   */
  async ngOnInit(): Promise<void> {
    this._userData = await this.user.fetchUserData();
    console.log("Current user Data : ", this._userData);
    const currentStreak = await this.user.updateUserStreak(this._userData.streak);
    this._streakDays = this.user.getUserStreak(currentStreak);
    
  }

  /**
   * Generate from the timestamp, the equivalent string representation
   * 
   * @param timeStamp firebase time format
   * @returns the string representation of timestamp in the actual language
   */
  convertTimeStampInDate(timeStamp: string): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }

    return new Date(timeStamp).toLocaleDateString(this.translate.defaultLang, options);
  }

  /**
   * Collect the content of the treasure chest and keep it.
   */
  async collectTreasure(): Promise<void> {
    const userStreak = this.user.getUserStreak(this._userData.streak);
    if(userStreak >= 7) {
      // Randomly generate a xp amount between a range
      const xpEarned = 500 + Math.ceil(Math.random() * 50) * 10;
  
      // update the player stats accordingly
      // Earn Xp and reinitialize the streak stat
      this._userData = await this.user.updateUserDoc({xp: this._userData.xp + xpEarned, streak: [new Date().toLocaleDateString("en-EN")]})
      
      // Show the toast notification
      this._notification = {
        type: 'success',
        message: `+ ${xpEarned} Points of experience !`
      }
      // Update local stats for UI refresh
      this._streakDays = this.user.getUserStreak(this._userData.streak);
    }
  }
}