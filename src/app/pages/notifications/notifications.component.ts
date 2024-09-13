import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

export const SELECTION_OPTIONS = ["ranking", "action", "info"]

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotificationsComponent {

  selectedOptions!: string[];
  selectionsOptions = SELECTION_OPTIONS;

  constructor() {
    this.selectedOptions = []
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
