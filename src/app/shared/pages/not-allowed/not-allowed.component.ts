import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-not-allowed',
    imports: [TranslateModule, RouterLink],
    templateUrl: './not-allowed.component.html',
    styleUrl: './not-allowed.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotAllowedComponent {

}
