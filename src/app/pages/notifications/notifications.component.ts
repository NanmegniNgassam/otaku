import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Notification } from '../../models/user';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

export const SELECTION_OPTIONS = ["ranking", "action", "info"]

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotificationsComponent {
  notifications!: Notification[];
  availableNotifications!: Notification[];
  notificationsGroups!: Notification[][];
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
        isPositive: true,
        date: new Date("9/19/2024")
      },
      {
        type: 'ranking',
        title: "Downgrading",
        message: "You went from 9th to 15th",
        isUnread : true,
        isPositive: true,
        date: new Date("9/19/2024")
      },
      {
        type: 'action',
        title: "Account Validation",
        message: "Please, may you validate your e-mail",
        isUnread: true,
        isPositive: true,
        action: '/account/settings',
        date: new Date("9/19/2024")
      },
      {
        type: 'info',
        title: "Xp gain",
        message: "You won 6 000 Xp lately",
        isUnread: false,
        isPositive: true,
        date: new Date("9/17/2024")
      }
    ];
    

    this.notifications = this.filterNotifications();
    this.notificationsGroups = this.addNotificationsInDateSlot(this.notifications)
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
    this.notificationsGroups = this.addNotificationsInDateSlot(this.notifications)
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

  /**
   * gather received notifications on the received date basis and dispatch in iterable format 
   * 
   * @param notifications the received notifications
   * @returns a 2-dimensions array
   */
  addNotificationsInDateSlot(notifications: Notification[]): Notification[][] {
    let result:{[date_key: string] : Notification[]} = {};
    let iterableResult:Notification[][] = [];
    const readNotifications = notifications.filter((notif) => !notif.isUnread);
    const unReadNotifications = notifications.filter((notif) => notif.isUnread)

    for(let notification of readNotifications) {
      if(result.hasOwnProperty(notification.date.toLocaleDateString())) {
        result[notification.date.toLocaleDateString()].push(notification)
      } else {
        result[notification.date.toLocaleDateString()] = [notification]
      }
    }

    for(const entry in result) {
      iterableResult.push(result[entry])
    }

    iterableResult.unshift(unReadNotifications)

    return iterableResult;
  }
}

// TODO: Valider le statut de lecture des notifications