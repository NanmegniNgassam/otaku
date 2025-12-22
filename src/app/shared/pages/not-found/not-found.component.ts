import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-not-found',
    imports: [RouterLink, TranslateModule],
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotFoundComponent {

}
