import { Component, Input } from '@angular/core';
import { User } from '@angular/fire/auth';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CircleAvatarComponent } from "../../circle-avatar/circle-avatar.component";

@Component({
    selector: 'app-sign-in-links',
    imports: [CircleAvatarComponent, TranslateModule, RouterLink, RouterLinkActive],
    templateUrl: './sign-in-links.component.html',
    styleUrl: './sign-in-links.component.scss'
})
export class SignInLinksComponent {
  @Input() user!: User;
}
