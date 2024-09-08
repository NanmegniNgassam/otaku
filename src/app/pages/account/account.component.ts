import { AsyncPipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CircleAvatarComponent } from "../../components/circle-avatar/circle-avatar.component";
import AuthService from '../../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { UserData } from '../../models/user';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [AsyncPipe, CircleAvatarComponent, TranslateModule, RouterLink],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccountComponent implements OnInit {
  user$ = this.auth.user$;
  STREAK_STEPS = [1, 2, 3, 4, 5, 6, 7]
  streakDays!: number;
  userData: UserData = {
    level: 'f',
    xp: 0,
    quests: 0,
    favoriteGenres: [],
    animeListIds: [],
    streak: [],
    params: {},
    position: 0
  }; 

  constructor(
    protected auth: AuthService,
    private translate: TranslateService,
    private user: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    this.userData = await this.user.fetchUserData();
    console.log("Current user Data : ", this.userData);
    const currentStreak = await this.user.updateUserStreak(this.userData.streak);
    this.streakDays = this.user.getUserStreak(currentStreak);
    
  }

  convertTimeStampInDate(timeStamp: string): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }

    return new Date(timeStamp).toLocaleDateString(this.translate.defaultLang, options);
  }
}

// TODO: Adjust the display of numbers (xp and quests)
