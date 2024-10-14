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

  /**
   * Check the equivalence of two arrays of identical content types
   * 
   * @param firstArray array to compare
   * @param secondArray array to compare
   * @param isPositionRelevant whether if or not the item position in the arrays matter (default to false)
   * 
   * @returns whether both arrays are equivalent or not
   */
  isArraysIdentical<ContentType>(firstArray: ContentType[], secondArray: ContentType[], isPositionRelevant: boolean = false): boolean {
    // Just check the lengths and draw a conclusion
    if (firstArray.length !== secondArray.length) 
      return false;

    // Discuss the equivalence according to the position importance
    if(isPositionRelevant) {
      return JSON.stringify(firstArray) === JSON.stringify(secondArray);
    } else {
      return firstArray.every((item) => secondArray.includes(item));
    }
  }
}
