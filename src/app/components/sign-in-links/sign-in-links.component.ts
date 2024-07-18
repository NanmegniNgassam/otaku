import { Component } from '@angular/core';
import { CircleAvatarComponent } from "../circle-avatar/circle-avatar.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sign-in-links',
  standalone: true,
  imports: [CircleAvatarComponent, TranslateModule],
  templateUrl: './sign-in-links.component.html',
  styleUrl: './sign-in-links.component.scss'
})
export class SignInLinksComponent {
}
