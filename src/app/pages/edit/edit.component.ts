import { AsyncPipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { updateProfile } from '@angular/fire/auth';
import { TranslateModule } from '@ngx-translate/core';
import { UserData } from '../../models/user';
import AuthService from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../services/utils.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnimeGenre } from '../../models/anime';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [AsyncPipe, TranslateModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EditComponent implements OnInit {
  user$ = this.auth.user$;
  _isAvatarOptionsDisplayed: boolean = false;
  _avatarOptionsTimer!: NodeJS.Timeout;
  _newAvatarFile!:File|null;
  _userData!: UserData;
  _isAvatarUploading!:boolean;
  _editForm!:FormGroup;
  _genreSuggestions!:AnimeGenre[];
  _isSavingData!:boolean;

  constructor(
    private user: UserService,
    private auth: AuthService,
    protected util: UtilsService,
    protected formBuilder: FormBuilder
  ) {
    this._isSavingData = false;
    this._genreSuggestions = [
      {id: 1, name: "Love"},
      {id: 1, name: "Romance"},
      {id: 1, name: "Horror"},
      {id: 1, name: "Hentai"},
    ]
  }

  /**
   * Performs general actions right after initialization
   */
  async ngOnInit(): Promise<void> {
    this._userData = await this.user.fetchUserData();

    this._editForm = this.formBuilder.group({
      username: [this.auth.currentUser!.displayName, [Validators.required, Validators.minLength(8)]],
      animeGenres: [this._userData.favoriteGenres, [Validators.required]]
    }, {
      updateOn: "change"
    })
  }

  /**
   * Show/Display all options referring to avatar 
   */
  toggleAvatarOptions() {
    clearTimeout(this._avatarOptionsTimer)
    this._isAvatarOptionsDisplayed = !this._isAvatarOptionsDisplayed;

    if(this._isAvatarOptionsDisplayed) {
      this._avatarOptionsTimer = setTimeout(() => {
        this._isAvatarOptionsDisplayed = false;
      }, 10000)
    }
  }

  async deleteUserAvatar(): Promise<void> {
    this.toggleAvatarOptions();

    try {
      this._isAvatarUploading = true;

      // Delete current avatar in storage
      await this.user.deleteAvatarDocContent();

      // Update current profile
      await updateProfile(this.auth.currentUser!, { photoURL: "" })

      this.auth.currentUser!.reload();
    } catch(error) {
      console.error("Error while deleting your avatar : ", error)
    }
    finally {
      this._isAvatarUploading = false;
    }
  }

  /**
   * Remove new avatar proposition
   */
  dismissNewAvatar(): void {
    this._newAvatarFile = null
  }

  /**
   * Store avatar proposition and update user
   */
  async validateNewAvatar(): Promise<void> {
    try {
      if(this._newAvatarFile) {
        this._isAvatarUploading = true;
        const fileExtension = this._newAvatarFile.type.split('/')[1]

        await this.user.storeNewAvatar(this._newAvatarFile, fileExtension)

        // Dismiss the new avatar as the old new avatar is the avatar now
        // Display a toast notification
        this.dismissNewAvatar();
      }
    } catch(error) {
      console.error('Error while uploading new avatar : ', error);
      // Display a toast notification
    } finally {
      this._isAvatarUploading = false;
    }
  }

  /**
   * 
   * @param avatarBlob the file to store in the cloud
   * @returns the URL(string) derived from the blob file
   */
  generateAvatarUrl(avatarBlob: File): string {
    return URL.createObjectURL(avatarBlob)
  }

  /**
   * Listener function triggered by changing avatar
   */
  onAvatarChange(): void {
    const fileInput = document.getElementById('avatar') as HTMLInputElement;

    const avatarBlob = fileInput.files![0]
    this._newAvatarFile = avatarBlob;

    this.toggleAvatarOptions()
  }

  async onSaveData(): Promise<void> {
    try {
      this._isSavingData = true;

      setTimeout(() => {

      }, 3000)

    } catch(error) {

    } 
    finally {
      // this._isSavingData = false;
    }
  }
}
