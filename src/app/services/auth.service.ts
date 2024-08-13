import { Injectable, OnInit } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, signInWithPopup, signOut, updateProfile, User, user, UserCredential } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { browserSessionPersistence, setPersistence } from "firebase/auth";
import { LoginCredential, SigninCredential } from "../models/others";

@Injectable({
  providedIn: 'root'
}) 

export default class AuthService {
  user$ = user(this.auth);
  currentUser: User | null = this.auth.currentUser;
  googleProvider = new GoogleAuthProvider();


  constructor(
    private auth: Auth,
    private router: Router
  ) {
    this.user$.subscribe((currentUser: User | null) => {
      this.currentUser = currentUser;
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
    await setPersistence(this.auth, browserSessionPersistence);

    return signInWithEmailAndPassword(this.auth, loginCredentials.email, loginCredentials.password);
  }

  /**
   * Log a visitor using its google account
   * 
   * @returns Google account Credential
   */
  async loginWithGoogle() {
    // Set the persistence to session stage
    await setPersistence(this.auth, browserSessionPersistence);

    // generate the popup for the login
    const result = await signInWithPopup(this.auth, this.googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

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

      this.router.navigateByUrl('/sign-in');
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
      await setPersistence(this.auth, browserSessionPersistence);

      // Create user account and update its informations
      const userCredential = await createUserWithEmailAndPassword(this.auth, credentials.signinEmail, credentials.signinPassword);
      await updateProfile(userCredential.user, {displayName: credentials.signinNickName});

      // send verification email
      await sendEmailVerification(userCredential.user);

      // Create a user document to store all its data

      return this.router.navigateByUrl('/');
    } catch(error:any) {
      console.error("Error occuring when creating user profile : ", error.message);
      throw(error);
    }
  }
}

// TODO: Create a page to remind the newly user to validate its account by email