import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UtilsService } from '../../services/utils.service';
import AuthService from '../../services/auth.service';
import { AsyncPipe } from '@angular/common';
import { EXPLICIT_CONTENT_GENRES } from '../../services/anime.service';
import { UserService } from '../../services/user.service';
import { UserData } from '../../models/user';

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
  _forbiddenGenres: string[] = [];
  _safeGenres: string[] = [];
  _userData!: UserData;
  _isWaitingSave: boolean = false;
  _genresManagementBox: boolean = false;

  /**
   * 
   * @param auth auth service
   * @param translate translate service
   * @param user user/db service
   * @param router router service
   */
  constructor(
    protected util:UtilsService,
    private auth:AuthService,
    private user:UserService,
    private router: Router
  ) {
  }

  /**
   * Performs some general tasks right after construction
   */
  async ngOnInit() {
    this._userData = await this.user.fetchUserData();
    
    this._forbiddenGenres = [...this._userData.params.forbiddenGenres.sort()];
    this._safeGenres = EXPLICIT_CONTENT_GENRES.filter(genre => !this._forbiddenGenres.includes(genre)).sort();
  }

  /**
   * Updates the genres list (forbidden or safe)
   */
  updateGenres = (genre: string, actionType: 'authorize' | 'forbid'): void => {
    if (actionType === 'authorize') {
      this._forbiddenGenres = this._forbiddenGenres.filter(g => g !== genre);
      this._safeGenres.push(genre);
      this._safeGenres.sort();
    } else {
      this._safeGenres = this._safeGenres.filter(g => g !== genre);
      this._forbiddenGenres.push(genre);
      this._forbiddenGenres.sort();
    }
    this._isWaitingSave = this.isSaveble();
  }

  /**
   * Check if it's any changes in the forbidden genres list
   */
  isSaveble = (): boolean => {
    if(this._userData) {
      return !this.util.isArraysIdentical<string>(this._userData.params.forbiddenGenres, this._forbiddenGenres)
    } else {
      return false;
    }
  }

  /**
   * Saves the changes made in the forbidden genres list
   */
  saveChanges = async () => {
    if(this.isSaveble()) {
      try {
        this._userData.params.forbiddenGenres = [...this._forbiddenGenres];
        await this.user.updateUserDoc({ params: this._userData.params});
        this._isWaitingSave = false;
      } catch (error) {
        console.error("Error while saving the forbidden list : ", error);
      }
    }
  }

  /**
   * Toggles the genres management box
   */
  toggleGenresManagementBox = () => {
    this._genresManagementBox = !this._genresManagementBox;
  }

  goToAccount = () => {
    // Check if all changes are saved 
    this.router.navigate(['/account']);

    // Else, show a modal to let the user know that he has unsaved changes and give him the possibility to continue without saving or to save the changes
  }
}
// TODO: Mettre la fonctionnalité de photo de profil dans un composant à part.
// TODO: Créer une modale pour la validation de la suppression de compte