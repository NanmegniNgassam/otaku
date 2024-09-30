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
import { AnimeService } from '../../services/anime.service';

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
  _genreSuggestions!:string[];
  _isSavingData!:boolean;

  constructor(
    private user: UserService,
    private auth: AuthService,
    protected util: UtilsService,
    protected anime: AnimeService,
    protected formBuilder: FormBuilder
  ) {
    this._isSavingData = false;
  }

  /**
   * Performs general actions right after initialization
   */
  async ngOnInit(): Promise<void> {
    this._userData = await this.user.fetchUserData();

    this._genreSuggestions = (await this.anime.suggestAnimeGenres(this._userData.favoriteGenres)).slice(0,8)

    this._editForm = this.formBuilder.group({
      username: [this.auth.currentUser!.displayName, [Validators.required, Validators.minLength(8), Validators.maxLength(25)]],
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

  /**
   * Save new user data
   */
  async onSaveData(): Promise<void> {
    try {
      this._isSavingData = true;

      // Update new valid Pseudo
      // TODO: Add a validation pseudo function
      updateProfile(this.auth.currentUser!, { displayName: this._editForm.value.username})

      // Update new avatar
      if(this._newAvatarFile) {
        await this.validateNewAvatar();
      }

      // Save user new data on firebase
      await this.user.updateUserDoc({ favoriteGenres: this._userData.favoriteGenres, playerName: this._editForm.value.username })

    } catch(error) {
      console.error('Error while saving user data : ', error)
    } 
    finally {
      this._isSavingData = false;
    }
  }

  /**
   * Add an anime genre in user favorites
   * 
   * @param selectedGenre Anime genre selected
   */
  addAnimeGenre(selectedGenre: string) {
    // Check if the genre is in user favorites
    if(!this._userData.favoriteGenres.includes(selectedGenre)) {
      // Add it to favorites
      this._userData.favoriteGenres.push(selectedGenre);

      // Remove it from suggestions
      this._genreSuggestions = this._genreSuggestions.filter((genre) => genre !== selectedGenre);
    }
  }

  /**
   * Remove an anime genre from user favorites
   * 
   * @param selectedGenre Anime genre selected
   */
  removeAnimeGenre(selectedGenre: string) {
    // Check if the genre is in suggested genre
    if(!this._genreSuggestions.includes(selectedGenre)) {
      // Remove it from favorites
      this._userData.favoriteGenres = this._userData.favoriteGenres.filter((genre) => genre !== selectedGenre)

      // Add to suggestions
      this._genreSuggestions.push(selectedGenre);
    }
  }
}
