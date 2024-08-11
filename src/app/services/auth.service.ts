import { Injectable, OnInit } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, signInWithPopup, signOut, updateProfile, User, user, UserCredential } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { browserSessionPersistence, setPersistence } from "firebase/auth";

@Injectable({
  providedIn: 'root'
}) 

export default class AuthService implements OnInit {
  user$ = user(this.auth);
  currentUser: User | null = this.auth.currentUser;
  provider = new GoogleAuthProvider();


  constructor(
    private auth: Auth,
    private router: Router
  ) {
    this.user$.subscribe((currentUser: User | null) => {
      this.currentUser = currentUser;
    })
  }

  /**
   * Perform some general action right after the constructor
   */
  async ngOnInit(): Promise<void> {
    // Set the persistence to session stage
    await setPersistence(this.auth, browserSessionPersistence);
  }

  /**
   * Check if the loginCrendential already exits and log user in
   * 
   * @param loginCredentials (email/password)
   * @returns UserCredential or throw an Error 
   */
  async login(loginCredentials : {email: string, password: string}): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, loginCredentials.email, loginCredentials.password);
  }

  /**
   * Log a visitor using its google account
   * 
   * @returns Google account Credential
   */
  async loginWithGoogle() {
    // generate the popup for the login
    const result = await signInWithPopup(this.auth, this.provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    // Redirect the newly login user
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
  async createAccount(credentials: {signinEmail: string, signinPassword: string, signinNickName: string}): Promise<boolean> {
    try {
      // Create user account and update its informations
      const userCredential = await createUserWithEmailAndPassword(this.auth, credentials.signinEmail, credentials.signinPassword);
      await updateProfile(userCredential.user, {displayName: credentials.signinNickName});

      // send verification email
      await sendEmailVerification(userCredential.user);

      // Create a user document to store all its data

      return this.router.navigateByUrl('/');
    } catch(error:any) {
      console.error("Error occuring when creating user profile : ", error.message);
      return false;
    }
    
  }
}