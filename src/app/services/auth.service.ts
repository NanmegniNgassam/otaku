import { Injectable, OnInit } from "@angular/core";
import { Auth, browserLocalPersistence, createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, signInWithPopup, signOut, updateProfile, User, user, UserCredential } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { setPersistence } from "firebase/auth";
import { LoginCredential, SigninCredential } from "../models/others";
import { UserService } from "./user.service";

@Injectable({
  providedIn: 'root'
}) 

export default class AuthService implements OnInit {
  user$ = user(this.auth);
  currentUser: User | null = this.auth.currentUser;
  googleProvider = new GoogleAuthProvider();
  playerPseudos: string[] =  [];

  constructor(
    private auth: Auth,
    private router: Router,
    private db: UserService 
  ) {
    this.user$.subscribe((currentUser: User | null) => {
      this.currentUser = currentUser;
    })
  }

  /**
   * Performs some general actions right after initialization
   */
  async ngOnInit(): Promise<void> {
    this.playerPseudos = await this.db.getGeneralUsersData();
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

      // Create user account and update its informations
      const userCredential = await createUserWithEmailAndPassword(this.auth, credentials.signinEmail, credentials.signinPassword);
      await updateProfile(userCredential.user, {displayName: credentials.signinNickName});
      // TODO: Use pseudo validation when needed

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
    const playerNames = this.playerPseudos.map((playerName) => playerName.toLowerCase());

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
    const isPseudoUnique = !playerNames.includes(pseudo.toLowerCase());
    const isSpecialCharsValid = specialCharacterOccurences <= 1;
    const isFiguresValid = figuresOccurences <= 2;

    return isLengthValid && isPseudoUnique && isSpecialCharsValid && isFiguresValid;
  }

  // TODO: Separate pseudoValidity and pseudoUnicity to provide better return to User.
  verifyPseudoUnicity(pseudo: string): boolean {

    return false;
  }
}