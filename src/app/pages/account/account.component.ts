import { AsyncPipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CircleAvatarComponent } from "../../components/circle-avatar/circle-avatar.component";
import AuthService from '../../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [AsyncPipe, CircleAvatarComponent, TranslateModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccountComponent {
  user$ = this.auth.user$;
  STREAK_STEPS = [1, 2, 3, 4, 5, 6, 7]
  streakDays: number = 4;

  constructor(
    protected auth: AuthService,
    private translate: TranslateService
  ) {
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
