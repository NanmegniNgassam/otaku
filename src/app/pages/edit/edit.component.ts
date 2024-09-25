import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { getApp } from '@angular/fire/app';
import { getStorage, ref } from '@angular/fire/storage';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EditComponent {
  isAvatarOptionsDisplayed: boolean = false;
  avatarOptionsTimer!: NodeJS.Timeout;
  newAvatarUrl!:string|null;

  toggleAvatarOptions() {
    clearTimeout(this.avatarOptionsTimer)
    this.isAvatarOptionsDisplayed = !this.isAvatarOptionsDisplayed;

    if(this.isAvatarOptionsDisplayed) {
      this.avatarOptionsTimer = setTimeout(() => {
        this.isAvatarOptionsDisplayed = false;
      }, 10000)
    }
  }

  dismissNewAvatar() {
    this.newAvatarUrl = null;
  }

  validateNewAvatar() {
    // Store the blob file on firebase.
    const storage = getStorage();

    const avatarsRef = ref(storage, 'avatars')

    console.log("fait!")

    // Set image on user profile.

    // Dismiss the new avatar as the old new avatar is the avatar now
    // this.dismissNewAvatar();
  }

  onAvatarChange() {
    const fileInput = document.getElementById('avatar') as HTMLInputElement;

    const avatarBlob = fileInput.files![0]
    const avatarUrl = URL.createObjectURL(avatarBlob)
    this.newAvatarUrl = avatarUrl

    this.toggleAvatarOptions()
  }
}
