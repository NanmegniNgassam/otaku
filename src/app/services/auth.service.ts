import { Injectable } from "@angular/core";
import { Auth, getRedirectResult, GoogleAuthProvider, OAuthCredential, signInWithPopup, signOut, User, user, UserCredential } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { signInWithEmailAndPassword } from "@firebase/auth";

@Injectable({
  providedIn: 'root'
}) 

export default class AuthService {
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
    // Applying browser preferences language
    auth.languageCode = "it";
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
    const result = await signInWithPopup(this.auth, this.provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

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
}