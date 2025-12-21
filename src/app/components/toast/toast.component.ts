import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Toast, ToastType } from '../../models/toast';

@Component({
    selector: 'app-toast',
    imports: [TranslateModule],
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ToastComponent implements OnInit, OnChanges {
  @Input() notification!: Toast | null;
  iconName!: string;

  /**
   * Performs some global actions right after the constructor
   */
  ngOnInit(): void {
    if(this.notification) {
      this.iconName = this.generateToastIconName(this.notification.type);
    }
  }

  /**
   * Performs some actions when a change occurs
   * 
   * @param changes occuring changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['notification'].previousValue?.type !== changes['notification'].currentValue?.type && this.notification) {
      this.iconName = this.generateToastIconName(this.notification.type);
    }
  }

  /**
   * Derive from the notification type the iconName and the title to show
   * 
   * @param type Type of the received notification
   * @returns the name of the icon to display
   */
  generateToastIconName (type : ToastType): string {
    switch(type) {
      case 'success':
        return 'happy-outline' 
      case 'fail':
        return 'sad-outline' 
      case 'warning':
        return 'warning-outline' 
      default:
        return 'information-outline' 
    }
  } 

  /**
   * Remove the current toast from the screen
   */
  closeToast() {
    this.notification = null;
  }
}
