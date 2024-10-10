import { AsyncPipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { updateProfile } from '@angular/fire/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Toast } from '../../models/toast';
import { UserData } from '../../models/user';
import { AnimeService } from '../../services/anime.service';
import AuthService from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [AsyncPipe, TranslateModule, ReactiveFormsModule, RouterModule, ToastComponent],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserFormComponent implements OnInit {
  _userData!:UserData;
  _genreSuggestions!:string[];
  _isSavingData!:boolean;
  _notification!: Toast | null;
  _editForm!:FormGroup;

  constructor(
    private user: UserService,
    private anime: AnimeService,
    private formBuilder: FormBuilder,
    private auth: AuthService
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
   * Save new user data
   */
  async onSaveData(): Promise<void> {
    try {
      this._isSavingData = true;
  
      if(this.auth.currentUser!.displayName !== this._editForm.value.username.trim()) {
        // Update new valid Pseudo
        if(this.auth.verifyPseudoValidity( this._editForm.value.username.trim())) {
          // modify the pseudo in users doc
          await this.user.modifyPseudofromUsersData(this.auth.currentUser!.displayName!, this._editForm.value.username.trim());
            
          await updateProfile(this.auth.currentUser!, { displayName: this._editForm.value.username.trim()})
        } else {
          this._notification = {
            type: 'fail',
            message: 'Your username is already in-use or not valid. Change it !'
          }
        }
      }
        
      // Update new avatar if needed
      // if(this._newAvatarFile) {
      //   await this.validateNewAvatar();
      // }
      // TODO: Received a blob as props to complete avatar change purpose.
  
      // Save user new data on firebase
      await this.user.updateUserDoc({ favoriteGenres: this._userData.favoriteGenres })
  
      // Show a validation when the save is well completed
      this._notification = {
        type: 'success',
        message: 'Vos modifications ont été enregistrées !'
      } 
  
    } catch(error) {
      console.error('Error while saving user data : ', error)
      this._notification = {
        type: 'warning',
        message: 'Your data can\'t be saved. Try again later !'
      }
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
