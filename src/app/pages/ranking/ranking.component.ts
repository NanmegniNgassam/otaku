import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RankingComponent {
  _isSearching = false;


  onSearch(searchValue: string) {
    if(!searchValue)
      return;

    this._isSearching = true;
  }

}
