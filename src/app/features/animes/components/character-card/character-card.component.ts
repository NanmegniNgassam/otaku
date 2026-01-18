import { Component, input, OnInit } from '@angular/core';
import { ExtendedCharacter } from '../../models/character';

@Component({
  selector: 'app-character-card',
  imports: [],
  templateUrl: './character-card.component.html',
  styleUrl: './character-card.component.scss',
})
export class CharacterCardComponent implements OnInit {
  extendedCharacter = input.required<ExtendedCharacter>();

  async ngOnInit() {
    console.log("Anime characters : ", this.extendedCharacter());
  }
}
