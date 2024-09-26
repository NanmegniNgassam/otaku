import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private translate: TranslateService
  ) {}

  /**
   * generate from a fullname the derived initials
   * 
   * @param username the name of the current service user
   * @returns the username initials in uppercase (like AW for Alex Wilcox)
   */
  generateNameInitials (username:string):string {
    let initials = '';
    const [firstName, lastName] = username.split(' ');

    
    initials+= firstName && firstName[0];
    initials+= lastName ? lastName[0] : '';

    return initials.toUpperCase();
  }

  /**
   * Generate from the timestamp, the equivalent string representation
   * 
   * @param timeStamp firebase time format
   * @returns the string representation of timestamp in the actual language
   */
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
