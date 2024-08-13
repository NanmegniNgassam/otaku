import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AVAILABLE_LANGUAGES, DEFAULT_APP_LANGUAGE, DEVICE_CHOSEN_LANGUAGE_KEY } from '../../../configs/language';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss'
})
export class LanguageSwitcherComponent implements OnInit {
  _chosenLanguage!:string|null;
  _prefNavigatorLanguages!:string[];
  _availableLanguages = [
    {value: 'fr', viewValue: 'Français'},
    {value: 'en', viewValue: 'English'},
  ];;

  constructor(private translate: TranslateService) {
    // Set a default app language
    translate.setDefaultLang(DEFAULT_APP_LANGUAGE);
  }

  /**
   * Performs some actions right after the constructor
   */
  ngOnInit(): void {
    this._chosenLanguage = localStorage.getItem(DEVICE_CHOSEN_LANGUAGE_KEY);
    this._prefNavigatorLanguages = [...window.navigator.languages];

    // Define the app local files to load 
    this.translate.setDefaultLang(this.getAppropriateLanguage());
  }

  /**
   * Triggered whenever a user change the language from the UI
   * 
   * @param event changeEvent occuring on the language selector
   */
  onLanguageSelect(event: Event):void {
    const language = (event.target as HTMLSelectElement).value;

    this.saveLanguageAsChosen(language);
    this.translate.setDefaultLang(language);
  }

  /**
   * Decide the app language according to saved language and browser preferences
   * 
   * @returns app language ISO code
   */
  getAppropriateLanguage():string {
    if(this._chosenLanguage) {
      if(this.checkLanguageLocalFiles(this._chosenLanguage)) {
        return this._chosenLanguage;
      } else {
        return DEFAULT_APP_LANGUAGE;
      }
    } else {
      let index = 0;
      while(!this.checkLanguageLocalFiles(this._prefNavigatorLanguages[index]) && index < this._prefNavigatorLanguages.length) {
        ++index;
      }

      if(index >= this._prefNavigatorLanguages.length) {
        return DEFAULT_APP_LANGUAGE;
      } else {
        this.saveLanguageAsChosen(this._prefNavigatorLanguages[index]);
        return this._prefNavigatorLanguages[index];
      }
    }
  }

  /**
   * are translations available for the specified languages ?
   * 
   * @param language to look for in the local files
   * @returns if the param language is available in i18n
   */
  checkLanguageLocalFiles(language:string):boolean {
    return AVAILABLE_LANGUAGES.includes(language);
  }

  /**
   * Save the ISO code as user choice in browser LocalStorage
   * 
   * @param language Iso code to set as user choice
   */
  saveLanguageAsChosen(language:string):void {
    if(AVAILABLE_LANGUAGES.includes(language)) {
      localStorage.setItem(DEVICE_CHOSEN_LANGUAGE_KEY, language);
    } else {
      throw Error("Selected language isn't supported by our app");
    }
  }
}
