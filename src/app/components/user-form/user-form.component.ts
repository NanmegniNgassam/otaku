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
import { UtilsService } from '../../services/utils.service';

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
  _newFavoriteGenres!: string[];
  _isSavingData!:boolean;
  _notification!: Toast | null;
  _editForm!:FormGroup;
  _isGenresUpdated!: boolean;

  constructor(
    private user: UserService,
    private anime: AnimeService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    protected util: UtilsService
  ) {
    this._isSavingData = false;
    this._isGenresUpdated = false;
  }

  /**
   * Performs general actions right after initialization
   */
  async ngOnInit(): Promise<void> {
    this._userData = await this.user.fetchUserData();

    this._genreSuggestions = (await this.anime.suggestAnimeGenres(this._userData.favoriteGenres)).slice(0,8);

    this._newFavoriteGenres = [...new Set(this._userData.favoriteGenres)];

    this._editForm = this.formBuilder.group({
      username: [this.auth.currentUser!.displayName, [Validators.required, Validators.minLength(8), Validators.maxLength(25)]],
    }, {
      updateOn: "change"
    })
  }

  // TODO: Explore Firebase transaction
  /**
   * Save new user data
   */
  async onSaveData(): Promise<void> {
    try {
      this._isSavingData = true;
      // Dismiss latest toast validation
      this._notification = null;
      
  
      if(this.auth.currentUser!.displayName !== this._editForm.value.username.trim()) {
        // Update new valid Pseudo
        if(this.auth.verifyPseudoValidity( this._editForm.value.username.trim())) {
          // modify the pseudo in users doc
          await this.user.modifyPseudofromUsersData(this.auth.currentUser!.displayName!, this._editForm.value.username.trim());
          // Modify pseudo in user doc also
          await this.user.updateUserDoc({playerName: this._editForm.value.username.trim() as string})
            
          await updateProfile(this.auth.currentUser!, { displayName: this._editForm.value.username.trim()})
        } else {
          this._notification = {
            type: 'fail',
            message: 'Your username is already in-use or not valid. Change it !'
          }
        }
      }
  
      // Save user new data on firebase
      await this.user.updateUserDoc({ favoriteGenres: this._newFavoriteGenres })
  
      // Show a validation when the save is well completed
      this._notification = {
        type: 'success',
        message: 'Vos modifications ont bien été enregistrées !'
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
    if(!this._newFavoriteGenres.includes(selectedGenre)) {
      // Add it to favorites
      this._newFavoriteGenres.push(selectedGenre);
  
      // Remove it from suggestions
      this._genreSuggestions = this._genreSuggestions.filter((genre) => genre !== selectedGenre);
    }
    console.log("Genres Diff : ", this.util.isArraysIdentical(this._userData.favoriteGenres, this._newFavoriteGenres, true));
    this._isGenresUpdated = !this.util.isArraysIdentical(this._userData.favoriteGenres, this._newFavoriteGenres, true);
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
      this._newFavoriteGenres = this._newFavoriteGenres.filter((genre) => genre !== selectedGenre)
  
      // Add to suggestions
      this._genreSuggestions.push(selectedGenre);
    }
    console.log("Genres Diff : ", this.util.isArraysIdentical(this._userData.favoriteGenres, this._newFavoriteGenres, true));
    this._isGenresUpdated = !this.util.isArraysIdentical(this._userData.favoriteGenres, this._newFavoriteGenres, true);
  }
}
