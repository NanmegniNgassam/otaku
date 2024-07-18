import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LanguageSwitcherComponent } from "../language-switcher/language-switcher.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [LanguageSwitcherComponent, TranslateModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
