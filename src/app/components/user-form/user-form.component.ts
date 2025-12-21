import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { updateProfile } from '@angular/fire/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Toast } from '../../shared/models/toast';
import { UserData } from '../../models/user';
import { AnimeService } from '../../services/anime.service';
import AuthService from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../services/utils.service';
import { ToastComponent } from '../../shared/components/toast/toast.component';

const DEFAULT_MAX_ANIME_GENRES_SHOWN = 6;
const DEFAULT_MIN_SUGGESTIONS = 8;
const DEFAULT_MAX_GENRES_SUGGESTION = 24;
const ANIME_GENRE_STEP = 6;

@Component({
    selector: 'app-user-form',
    imports: [TranslateModule, ReactiveFormsModule, RouterModule, ToastComponent],
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
  _pseudoFieldStatus!: "invalid-pseudo" | "" | "pseudo-already-taken";
  _max_anime_genres_shown!:number;
  _default_max_anime_genres_shown!:number;
  _default_max_genres_suggestion!:number;
  _default_min_suggestions!:number;

  constructor(
    private user: UserService,
    private anime: AnimeService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    protected util: UtilsService
  ) {
    this._isSavingData = false;
    this._isGenresUpdated = false;
    this._max_anime_genres_shown = DEFAULT_MAX_ANIME_GENRES_SHOWN;
    this._default_max_anime_genres_shown = DEFAULT_MAX_ANIME_GENRES_SHOWN;
    this._default_max_genres_suggestion = DEFAULT_MAX_GENRES_SUGGESTION;
    this._default_min_suggestions = DEFAULT_MIN_SUGGESTIONS;
  }

  /**
   * Performs general actions right after initialization
   */
  async ngOnInit(): Promise<void> {
    this._userData = await this.user.fetchUserData();

    this._genreSuggestions = (await this.anime.suggestAnimeGenres(this._userData.favoriteGenres)).slice(0,DEFAULT_MIN_SUGGESTIONS);

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
    // Reset the pseudo field before validation
    this._pseudoFieldStatus = "";
    try {
      this._isSavingData = true;
      // Dismiss latest toast validation
      this._notification = null;
      
  
      if(this.auth.currentUser!.displayName !== this._editForm.value.username.trim()) {
        // Check if the new pseudo is valid according to our criteria
        if(this.auth.verifyPseudoValidity( this._editForm.value.username.trim())) {
          // Check is the new pseudo isn't taken by another player
          if(await this.auth.verifyPseudoUnicity(this._editForm.value.username.trim())) {
            // modify the pseudo in users doc
            await this.user.modifyPseudofromUsersData(this.auth.currentUser!.displayName!, this._editForm.value.username.trim());
            // Modify pseudo in user doc also
            await this.user.updateUserDoc({playerName: this._editForm.value.username.trim() as string});
            // Upadte the current profile
            await updateProfile(this.auth.currentUser!, { displayName: this._editForm.value.username.trim()});
          } else {
            this._notification = {
              type: 'fail',
              message: 'The pseudo entered is already taken !'
            };
            this._pseudoFieldStatus = 'pseudo-already-taken';
            return;
          }
        } else {
          this._notification = {
            type: 'fail',
            message: 'The pseudo proposed is not valid. Change it !'
          }
          this._pseudoFieldStatus = 'invalid-pseudo';
          return;
        }
      }
  
      if(!this.util.isArraysIdentical(this._newFavoriteGenres, this._userData.favoriteGenres, true)) {
        // Save user new data on firebase
        await this.user.updateUserDoc({ favoriteGenres: this._newFavoriteGenres })
      }

  
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
   * Increase/Decrease the number of preferences explicitly shown
   * 
   * @param action change to apply on Genre preferences number
   */
  modifyGenrePreferencesCount = (action: "more" | "less") => {
    if(action === "more" && this._newFavoriteGenres.length >= this._max_anime_genres_shown) {
      this._max_anime_genres_shown += ANIME_GENRE_STEP;
    }
    if(action === "less" && this._newFavoriteGenres.length > DEFAULT_MAX_ANIME_GENRES_SHOWN) {
      this._max_anime_genres_shown -= ANIME_GENRE_STEP;
    }
  }

  /**
   * Adds more suggestions proposed to the user
   */
  increaseGenresSuggestions = async () => {
    if(this._genreSuggestions.length < DEFAULT_MAX_GENRES_SUGGESTION) {
      const alreadyKnownGenres = [...new Set<string>([...this._newFavoriteGenres, ...this._genreSuggestions])];
      const newSuggestions = (await this.anime.suggestAnimeGenres(alreadyKnownGenres)).slice(0, ANIME_GENRE_STEP);

      this._genreSuggestions.push(...newSuggestions);
      this._genreSuggestions.slice(0, DEFAULT_MAX_GENRES_SUGGESTION);
    }
  }

  /**
   * Reduces the number of suggestions shown to the user
   */
  decreaseGenresSuggestions = async () => {
    if(this._genreSuggestions.length >= 2 * DEFAULT_MIN_SUGGESTIONS) {
      this._genreSuggestions = this._genreSuggestions.slice(0, this._genreSuggestions.length - DEFAULT_MIN_SUGGESTIONS);
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
      this._newFavoriteGenres.unshift(selectedGenre);
  
      // Remove it from suggestions
      this._genreSuggestions = this._genreSuggestions.filter((genre) => genre !== selectedGenre);
    }

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

    this._isGenresUpdated = !this.util.isArraysIdentical(this._userData.favoriteGenres, this._newFavoriteGenres, true);
  }
}