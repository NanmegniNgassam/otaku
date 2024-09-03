import { AsyncPipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CircleAvatarComponent } from "../../components/circle-avatar/circle-avatar.component";
import AuthService from '../../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { UserData } from '../../models/user';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [AsyncPipe, CircleAvatarComponent, TranslateModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccountComponent implements OnInit {
  user$ = this.auth.user$;
  STREAK_STEPS = [1, 2, 3, 4, 5, 6, 7]
  streakDays: number = 7;
  userData: UserData = {
    level: 'f',
    xp: 0,
    quests: 0,
    favoriteGenres: [],
    animeListIds: [],
    streak: [],
    params: {}
  }; 

  constructor(
    protected auth: AuthService,
    private translate: TranslateService,
    private db: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    this.userData = await this.db.fetchUserData();
    console.log("Current user Data : ", this.userData)
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
// TODO: Write a function to track the streak