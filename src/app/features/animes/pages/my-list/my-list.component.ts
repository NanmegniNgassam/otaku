import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AnimesListComponent } from '../../components/animes-list/animes-list.component';
import { Anime } from '../../models/anime';

@Component({
    selector: 'app-my-list',
    imports: [AnimesListComponent, TranslateModule],
    templateUrl: './my-list.component.html',
    styleUrl: './my-list.component.scss'
})
export class MyListComponent {
  animes = input.required<Anime[]>();
  protected skeletons: undefined[] = Array(10).fill(undefined);

  constructor() {}
}
