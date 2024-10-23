import { Injectable } from "@angular/core";
import { Auth, browserLocalPersistence, createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, signInWithPopup, signOut, updateProfile, User, user, UserCredential } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { setPersistence } from "firebase/auth";
import { LoginCredential, SigninCredential } from "../models/others";
import { UserService } from "./user.service";
import { TranslateService } from "@ngx-translate/core";

// TODO: Define a allErrors enum may be useful

@Injectable({
  providedIn: 'root'
}) 

export default class AuthService{
  user$ = user(this.auth);
  currentUser: User | null = this.auth.currentUser;
  googleProvider = new GoogleAuthProvider();
  _authErrors!: {[name: string] : string};

  constructor(
    private auth: Auth,
    private router: Router,
    private db: UserService,
    private translate: TranslateService
  ) {
    this.user$.subscribe((currentUser: User | null) => {
      this.currentUser = currentUser;
    })

    // Get form errors from i18n in the current app language
    translate.stream("services.authentication.errors").subscribe((authErrors) => {
      this._authErrors = authErrors;
    })
  }


  /**
   * Check if the loginCrendential already exits and log user in
   * 
   * @param loginCredentials (email/password)
   * @returns UserCredential or throw an Error 
   */
  async login(loginCredentials : LoginCredential): Promise<UserCredential> {
    // Set the persistence to session stage
    await setPersistence(this.auth, browserLocalPersistence);

    return signInWithEmailAndPassword(this.auth, loginCredentials.email, loginCredentials.password);
  }

  /**
   * Log a visitor using its google account
   * 
   * @returns Google account Credential
   */
  async loginWithGoogle() {
    // Set the persistence to session stage
    await setPersistence(this.auth, browserLocalPersistence);

    // generate the popup for the login
    const result = await signInWithPopup(this.auth, this.googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    // Check if the account is newly created (created less than 1 minutes earlier)
    const timeDiff = Date.now().valueOf() - new Date(result.user.metadata.creationTime!).valueOf();
    if(timeDiff < 30*1000) {
      // Create a user document to store all its data
      await this.db.createUserDocument(result.user.uid);
    }

    // Redirect the newly login user after login
    this.router.navigateByUrl('/');
    return credential;
  }

  /**
   * Log current user out
   */
  async logout() {
    try {
      await signOut(this.auth);

      this.router.navigateByUrl('/');
    } catch(error: any) {
      console.error("Error occurs when signing out : ", error.message);
      // TODO: Set the error {type: string, message: string} and then throw it.
      const formattedError = {
        type: error.type || 'logout-error',
        message: error.message || this._authErrors['logout']
      }
      throw(error);
    }
  }

  /**
   * Create a new user account
   * 
   * @param credentials new user informations
   * @returns Whether if the creation was successful or not
   */
  async createAccount(credentials: SigninCredential ): Promise<boolean> {
    try {
      // Set the persistence to session stage
      await setPersistence(this.auth, browserLocalPersistence);

      // Check the signinNickname validity
      if(!this.verifyPseudoValidity(credentials.signinNickName.trim())) {
        throw({
          code: 'invalid-pseudo',
          message: 'The given pseudo is invalid. Try another one !'
        });
      }

      // Check if the signinNickname unicity
      if(!(await this.verifyPseudoUnicity(credentials.signinNickName.trim()))) {
        throw({
          code: 'pseudo-already-used',
          message: 'The given pseudo is already taken !'
        });
      }

      // Create user account, update its informations and add new pseudo in users document
      const userCredential = await createUserWithEmailAndPassword(this.auth, credentials.signinEmail, credentials.signinPassword);
      await updateProfile(userCredential.user, {displayName: credentials.signinNickName});
      await this.db.modifyPseudofromUsersData("", credentials.signinNickName);

      // send verification email
      await this.sendVerificationEmail(userCredential.user);

      // Create a user document to store all its data
      await this.db.createUserDocument(userCredential.user.uid);

      return this.router.navigateByUrl('/email-verification');
    } catch(error:any) {
      console.error("Error occuring when creating new user account : ", error.message);
      throw(error);
    }
  }

  /**
   * Send a verification email to user (if not verified)
   * 
   * @param user currently logged in user
   */
  async sendVerificationEmail(user: User): Promise<void> {
    // TODO: Production change to made : IMPORTANT
    await sendEmailVerification(user, {url: "http://localhost:4200/account"});
  }

  /**
   * Check the validity of a pseudo according to following standards
   * 
   * - A length between 8 and 25 characters
   * - A max of 02 figures
   * - A max of 01 special character
   * 
   * @param pseudo new proposed username
   * @returns whether the pseudo is valid or not.
   */
  verifyPseudoValidity(pseudo: string): boolean {
    const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;
    const FIGURE_REGEX = /[0-9]/;
    let figuresOccurences = 0;
    let specialCharacterOccurences = 0;

    // Cycle through the pseudo and determine special characters and figures
    pseudo.split('').filter((letter) => letter != ' ').forEach((letter: string) => {
      if(SPECIAL_CHAR_REGEX.test(letter)) {
        specialCharacterOccurences++;
      }
      if(FIGURE_REGEX.test(letter)) {
        figuresOccurences++;
      }
    })

    const isLengthValid = pseudo.length >= 8 && pseudo.length <= 25;
    const isSpecialCharsValid = specialCharacterOccurences <= 1;
    const isFiguresValid = figuresOccurences <= 2;

    return isLengthValid && isSpecialCharsValid && isFiguresValid;
  }

  /**
   * Check if the new user pseudo isn't already taken
   * 
   * @param pseudo the user pseudo to validate
   * @returns whether the new user pseudo is available or not
   */
  async verifyPseudoUnicity(pseudo: string): Promise<boolean> {
    const playerPseudos = await this.db.getGeneralUsersData();

    const playerNames = playerPseudos.map((playerName) => playerName.toLowerCase());

    return !playerNames.includes(pseudo.toLowerCase());
  }
}