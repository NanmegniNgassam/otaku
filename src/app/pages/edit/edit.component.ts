import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarEditComponent } from '../../components/avatar-edit/avatar-edit.component';
import { UserFormComponent } from '../../components/user-form/user-form.component';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ TranslateModule, UserFormComponent, AvatarEditComponent],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EditComponent {
}
// TODO: Rajouter des modalités comme 'Voir tout - cacher', 'Aucun favori selectionné', 'voir de nouvelles suggestions', ...