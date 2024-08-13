import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sign-out-links',
  standalone: true,
  imports: [TranslateModule, RouterLink, RouterLinkActive],
  templateUrl: './sign-out-links.component.html',
  styleUrl: './sign-out-links.component.scss'
})
export class SignOutLinksComponent {

}
