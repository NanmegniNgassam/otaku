import { AsyncPipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, signal, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { Toast } from '../../shared/models/toast';
import { Notification, UserData } from '../../models/user';
import AuthService from '../../core/services/auth.service';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../shared/services/utils.service';
import { AvatarComponent } from "../../shared/components/avatar/avatar.component";

@Component({
    selector: 'app-account',
    imports: [AsyncPipe, TranslateModule, ToastComponent, RouterLink, AvatarComponent],
    templateUrl: './account.component.html',
    styleUrl: './account.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccountComponent implements OnInit {
  user$ = this.auth.user$;
  STREAK_STEPS = [1, 2, 3, 4, 5, 6, 7]
  _streakDays!: number;
  _notification!: Toast | null;
  _userData = signal<UserData>({
    level: 'f',
    xp: 0,
    credits: 0,
    quests: 0,
    favoriteGenres: [],
    animeListIds: [],
    streak: [],
    params: { forbiddenGenres: [] },
    position: 0,
    playerName: this.auth.currentUser?.displayName!,
    games: [],
    notifications: []
  }); 

  /**
   * 
   * @param auth auth service
   * @param translate translate service
   * @param user user/db service
   */
  constructor(
    protected auth: AuthService,
    private user: UserService,
    protected util: UtilsService
  ) {
    this.user$ = this.auth.user$;
  }

  /**
   * Performs some general tasks right after construction
   */
  async ngOnInit(): Promise<void> {
    const userData = await this.user.fetchUserData();
    this._userData.set(userData);

    console.log("Current user Data : ", this._userData());
    const currentStreak = await this.user.updateUserStreak(this._userData().streak);
    this._streakDays = this.user.getUserStreak(currentStreak);
  }

  /**
   * Collect the content of the treasure chest and keep it.
   */
  async collectTreasure(): Promise<void> {
    const userStreak = this.user.getUserStreak(this._userData().streak);
    if(userStreak >= 7) {
      // Randomly generate a xp amount between a range
      const xpEarned = 500 + Math.ceil(Math.random() * 50) * 10;
  
      // update the player stats accordingly
      // Earn Xp and reinitialize the streak stat
      const userData = await this.user.updateUserDoc({xp: this._userData().xp + xpEarned, streak: [new Date().toLocaleDateString("en-EN")]})
      this._userData.set(userData);

      // Show the toast notification
      this._notification = {
        type: 'success',
        message: `+ ${xpEarned} Points of experience !`
      }
      // Update local stats for UI refresh
      this._streakDays = this.user.getUserStreak(this._userData().streak);
    }
  }

  /**
   * Get from avalaible notifications the number of unread one
   * 
   * @param notifications all received notifications
   * @returns the number of unread notifications
   */
  getUnreadNotificationsNumber(notifications: Notification[]): number {
    const unReadNotifications = notifications.filter((notif: Notification) => notif.isUnread);

    return unReadNotifications.length;
  }
}

// TODO: Add a 'you lost your streak' notifications