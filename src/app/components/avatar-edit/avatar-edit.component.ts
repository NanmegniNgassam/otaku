import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserService } from '../../services/user.service';
import AuthService from '../../services/auth.service';
import { UtilsService } from '../../services/utils.service';
import { UserData } from '../../models/user';
import { Toast } from '../../models/toast';
import { updateProfile } from '@angular/fire/auth';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-avatar-edit',
  standalone: true,
  imports: [AsyncPipe, TranslateModule],
  templateUrl: './avatar-edit.component.html',
  styleUrl: './avatar-edit.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AvatarEditComponent {
  user$ = this.auth.user$;
  _isAvatarOptionsDisplayed: boolean = false;
  _avatarOptionsTimer!: NodeJS.Timeout;
  _newAvatarFile!:File|null;
  _userData!: UserData;
  _isAvatarUploading!:boolean;
  _notification!: Toast | null;
  
  constructor(
    private user: UserService,
    private auth: AuthService,
    protected util: UtilsService,
  ) {
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

  /**
   * Delete avatar image in the storage(db) as well as in user data
   */
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
   * Listener function triggered by changing avatar
   */
  onAvatarChange(): void {
    const fileInput = document.getElementById('avatar') as HTMLInputElement;
  
    const avatarBlob = fileInput.files![0]
    this._newAvatarFile = avatarBlob;
  
    this.toggleAvatarOptions()
  }

  /**
   * Generate the URL associated to the blob file
   * 
   * @param avatarBlob the file to store in the cloud
   * @returns the URL(string) derived from the blob file
   */
  generateAvatarUrl(avatarBlob: File): string {
    return URL.createObjectURL(avatarBlob)
  }
}
