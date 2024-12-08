import { AsyncPipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AvatarComponent } from "../../components/avatar/avatar.component";
import { ToastComponent } from "../../components/toast/toast.component";
import { Toast } from '../../models/toast';
import { UserData } from '../../models/user';
import { AnimeService, EXPLICIT_CONTENT_GENRES } from '../../services/anime.service';
import AuthService from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../services/utils.service';
import { ModalComponent } from '../../components/modal/modal.component';
import { Modal } from '../../models/modal';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [TranslateModule, RouterLink, AsyncPipe, ToastComponent, AvatarComponent, ModalComponent, TranslateModule],
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
  _passwordBox: boolean = false;
  _isPasswordVisible: boolean = false;
  _notification!: Toast | null;
  _verifiedEmailStatus!: string;
  _pendingEmailStatus!: string;
  _modal!: Modal;
  _showModal: boolean = false;

  /**
   * 
   * @param auth auth service
   * @param translate translate service
   * @param user user/db service
   * @param router router service
   * @param util utils service
   */
  constructor(
    protected util:UtilsService,
    private auth:AuthService,
    private user:UserService,
    private router: Router,
    private translate: TranslateService,
    private anime: AnimeService
  ) {
    translate.stream("others.emailVerificationStatus").subscribe((emailStatus) => {
      this._verifiedEmailStatus = emailStatus['verified'];
      this._pendingEmailStatus = emailStatus['pending'];
    });
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

  togglePasswordBox = () => {
    this._passwordBox = !this._passwordBox;
  }

  togglePasswordVisibility() {
    this._isPasswordVisible = !this._isPasswordVisible;
  }

  goToAccount = () => {
    // Check if all changes are saved 
    this.router.navigate(['/account']);

    // Else, show a modal to let the user know that he has unsaved changes and give him the possibility to continue without saving or to save the changes
  }

  /**
   * Sends a verification email to the user
   */
  sendVerificationEmail = async () => {
    try {
      const currentUser = getAuth().currentUser!;
      await this.auth.sendVerificationEmail(currentUser);
      // show a toast to give user a feed-back on its action
      this._notification = {
        type: 'info',
        message: 'A verification email has been sent to your mailbox.',
      }

      setTimeout(() => {
        this.router.navigate(['/email-verification']);
        this._notification = null;
      }, 5* 1000);
    } catch (error) {
      console.error("Error while sending the verification email : ", error);

      // show a toast to give user a feed-back on its action
      this._notification = {
        type: 'fail',
        message: 'An error occured while sending the verification email.',
      }
    }
  }

  /**
   * Modify the password of the user using its email
   */
  modifyPasswordByEmail = async () => {
    try {
      // send user an email to reset its password
      await this.auth.resetPasswordUsingEmail();
      // show a toast to give user a feed-back on its action
      this._notification = {
        type: 'info',
        message: 'A password reset email has been sent to your mailbox.',
      }
    } catch (error) {
      console.error("Error while sending the password reset email : ", error);

      // show a toast to give user a feed-back on its action
      this._notification = {
        type: 'fail',
        message: 'An error occured while sending the password reset email.',
      }
    }
  }

  /**
   * Deletes the account of the user
   */
  showDeleteAccountModal = () => {
    // Prepare the modal to be shown
    this._modal = {
      title: 'Delete Account',
      message: 'Are you sure you want to delete your account ?',
      onConfirm: this.deleteAccount,
      onCancel: this.onDismissDeleteModal,
      isInformative: false
    };

    this._showModal = true;
  }

  /**
   * Dismiss the delete account modal
   */
  onDismissDeleteModal = () => {
    this._showModal = false;
  }

  /**
   * Deletes the account of the user
   */
  deleteAccount = async () => {
    try {
      const anime = await this.anime.getRandomAnime();
      console.log("Anime : ", anime);
    } catch (error) {
      console.error("Error while deleting the account : ", error);
      // TODO: Gérer les erreurs qui surviennent avec le toast
    }
  }
}