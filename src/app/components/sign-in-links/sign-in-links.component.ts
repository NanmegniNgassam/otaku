import { Component } from '@angular/core';
import { CircleAvatarComponent } from "../circle-avatar/circle-avatar.component";

@Component({
  selector: 'app-sign-in-links',
  standalone: true,
  imports: [CircleAvatarComponent],
  templateUrl: './sign-in-links.component.html',
  styleUrl: './sign-in-links.component.scss'
})
export class SignInLinksComponent {

}
