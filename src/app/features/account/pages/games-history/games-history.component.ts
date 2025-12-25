import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Notification } from '../../../../models/user';

@Component({
    selector: 'app-games-history',
    imports: [TranslateModule, RouterLink],
    templateUrl: './games-history.component.html',
    styleUrl: './games-history.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GamesHistoryComponent {
  notificationsGroups!: Notification[][]
}
