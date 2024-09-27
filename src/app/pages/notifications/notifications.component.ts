import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Notification } from '../../models/user';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';

export const SELECTION_OPTIONS = ["ranking", "action", "info"]

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotificationsComponent implements OnInit {
  notifications!: Notification[];
  availableNotifications!: Notification[];
  notificationsGroups!: Notification[][];
  selectedOptions!: string[];
  selectionsOptions = SELECTION_OPTIONS;

  /**
   * Component and services initialization
   * 
   * @param user ng service used 
   */
  constructor(
    private user : UserService
  ) {
    this.selectedOptions = [];
    this.availableNotifications = [];
  }

  /**
   * Performing some general actions right after initialization
   */
  async ngOnInit(): Promise<void> {
    const userData = await this.user.fetchUserData();
    this.availableNotifications = userData.notifications.map((notif) => {
      return {
        ...notif,
        date: new Date(notif.date)
      }
    });

    // Setting the first filtering
    this.notifications = this.filterNotifications();
    this.notificationsGroups = this.addNotificationsInDateSlot(this.notifications)

    // Assume notifications will be read and update their reading status
    await this.user.setNotificationsRead();
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

    // Seperate notifications according to issue date
    for(let notification of readNotifications) {
      if(result.hasOwnProperty(notification.date.toLocaleDateString())) {
        result[notification.date.toLocaleDateString()].push(notification)
      } else {
        result[notification.date.toLocaleDateString()] = [notification]
      }
    }

    // Add the filtered notifications decreasingly in the final array
    for(const entry in result) {
      iterableResult.push(result[entry])
    }
    iterableResult.unshift(unReadNotifications)

    return iterableResult;
  }
}