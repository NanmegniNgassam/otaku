import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Notification } from '../../models/user';

export const SELECTION_OPTIONS = ["ranking", "action", "info"]

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotificationsComponent {
  notifications!: Notification[];

  selectedOptions!: string[];
  selectionsOptions = SELECTION_OPTIONS;

  constructor() {
    this.selectedOptions = ["ranking"];
    this.notifications = [
      {
        type: 'ranking',
        title: "Upgrading",
        message: "You went from 12th to 9th position",
        isUnread : false,
        isPositive: true
      },
      {
        type: 'ranking',
        title: "Downgrading",
        message: "You went from 9th to 15th",
        isUnread : true,
        isPositive: true
      },
      {
        type: 'info',
        title: "Xp gain",
        message: "You won 6 000 Xp lately",
        isUnread : true,
        isPositive: true
      },
      {
        type: 'action',
        title: "Account Validation",
        message: "Please, may you validate your e-mail",
        isUnread : true,
        isPositive: true,
        action: '/account/settings'
      }
    ]
  }

  selectOption(option: string) {
    let options = this.selectedOptions;

    if(!this.selectionsOptions.includes(option))
      return;

    if(this.selectedOptions.includes(option)) {
      this.selectedOptions = options.filter((opt) => opt !== option)
    } else {
      options.push(option)
      this.selectedOptions = [...new Set(options)]
    }
  }
}
