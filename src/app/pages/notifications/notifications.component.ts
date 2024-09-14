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
  availableNotifications!: Notification[];
  selectedOptions!: string[];
  selectionsOptions = SELECTION_OPTIONS;

  constructor() {
    this.selectedOptions = [];
    this.availableNotifications = [
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
    ];

    this.notifications = this.filterNotifications();
  }

  /**
   * Manage adding/removing selected categories
   * 
   * @param option the selected category
   * @returns none
   */
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

    this.notifications = this.filterNotifications();
  }

  /**
   * Filter the notifications according to selected categories
   * 
   * @returns the notifications which match selected options
   */
  filterNotifications(): Notification[] {
    let notifications: Notification[] = [];

    if(!this.selectedOptions.length) {
      notifications = this.availableNotifications;
    } else {
      notifications = this.availableNotifications.filter((notif: Notification) => this.selectedOptions.includes(notif.type))
    }

    return notifications
  } 
}
