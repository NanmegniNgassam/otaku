import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UtilsService } from '../../services/utils.service';
import AuthService from '../../services/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [TranslateModule, RouterLink, AsyncPipe],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SettingsComponent {
  _user$ = this.auth.user$;
  constructor(
    protected util:UtilsService,
    private auth:AuthService
  ) {
  }
}
// TODO: Proposer à l'utilisateur de spécifier les genres qu'il n'aimerait pas voir lors de sa navigation (option recherche)
// TODO: Mettre la fonctionnalité de photo de profil dans un composant à part.
// TODO: Créer une modale pour la validation de la suppression de compte