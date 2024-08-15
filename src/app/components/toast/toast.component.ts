import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { title } from 'process';

type ToastType = 'success' | 'fail' | 'warning' | 'info'

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ToastComponent implements OnInit {
  @Input() notificationType!: ToastType;
  @Input() message!: string;
  @Input() handleDismiss?: () => void;

  iconName!: string;
  titleLabel!: string;

  /**
   * Performs some global actions right after the constructor
   */
  ngOnInit(): void {
    const {iconName, titleLabel} = this.generateToastIconNameAndTitle(this.notificationType);
    this.iconName = iconName;
    this.titleLabel = titleLabel;
  }

  /**
   * Derive from the notification type the iconName and the title to show
   * 
   * @param type Type of the received notification
   * @returns an object made of matching iconName and title to display
   */
  generateToastIconNameAndTitle (type : ToastType): {iconName: string, titleLabel: string} {
    switch(type) {
      case 'success':
        return {
          iconName: 'happy-outline',
          titleLabel: type,
        }
      case 'fail':
        return {
          iconName: 'sad-outline',
          titleLabel: type,
        }
      case 'warning':
        return {
          iconName: 'warning-outline',
          titleLabel: type,
        }
      default:
        return {
          iconName: 'information-outline',
          titleLabel: type,
        }
    }
  } 

}
