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


  constructor(private translate: TranslateService) {
    translate.setDefaultLang(DEFAULT_APP_LANGUAGE);
  }

  ngOnInit(): void {
    this._prefNavigatorLanguages = [...window.navigator.languages];
    this.translate.setDefaultLang(this.getAppropriateLanguage());
  }

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

  checkLanguageLocalFiles(language:string):boolean {
    return AVAILABLE_LANGUAGES.includes(language);
  }

  saveLanguageAsChosen(language:string):void {
    if(AVAILABLE_LANGUAGES.includes(language)) {
      localStorage.setItem(DEVICE_CHOSEN_LANGUAGE_KEY, language);
    } else {
      throw Error("Selected language isn't supported by our app");
    }
    
  }
}
