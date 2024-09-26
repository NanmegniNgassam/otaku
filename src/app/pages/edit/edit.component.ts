import { AsyncPipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit } from '@angular/core';
import { updateProfile } from '@angular/fire/auth';
import { TranslateModule } from '@ngx-translate/core';
import { UserData } from '../../models/user';
import AuthService from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [AsyncPipe, TranslateModule],
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


  constructor(
    private user: UserService,
    private auth: AuthService,
    private eRef: ElementRef,
    protected util: UtilsService
  ) {
  }

  /**
   * Performs general actions right after initialization
   */
  async ngOnInit(): Promise<void> {
    
  }

  // TODO: Use this for the header to close the navbar when needed
  // @HostListener('document:click', ['$event'])
  // clickout(event: Event) {
  //   if(this.eRef.nativeElement.contains(event.target)) {
  //     console.log('click inside !')
  //   } else {
  //     console.log('click outside !')
  //   }
  // }

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
}
