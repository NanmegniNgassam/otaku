import { Component } from '@angular/core';
import { CircleAvatarComponent } from "../circle-avatar/circle-avatar.component";
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sign-in-links',
  standalone: true,
  imports: [CircleAvatarComponent, TranslateModule, RouterLink, RouterLinkActive],
  templateUrl: './sign-in-links.component.html',
  styleUrl: './sign-in-links.component.scss'
})
export class SignInLinksComponent {
}
