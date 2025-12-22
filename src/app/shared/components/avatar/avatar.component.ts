import { Component } from '@angular/core';
import { getAuth, User } from '@angular/fire/auth';
import { UtilsService } from '../../services/utils.service';

@Component({
    selector: 'app-avatar',
    imports: [],
    templateUrl: './avatar.component.html',
    styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
  _user!: User;

  constructor(
    protected util: UtilsService,
  ) {
  }

  async ngOnInit() {
    this._user = getAuth().currentUser!;
    console.log("Utilisateur dans Avatar component : ", this._user);
  }
}

// TODO: A l'inscription via Google, télécharger et stocker la photo de l'utilisateur sur firebase storage.
// Et mettre à jour l'url de l'image sous son profil. Ceci évitera les 429 à tout va.