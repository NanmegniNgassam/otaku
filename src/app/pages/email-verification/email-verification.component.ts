import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import AuthService from '../../services/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { updateProfile, User } from '@angular/fire/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EmailVerificationComponent implements OnInit {
  user$ = this.auth.user$;
  currentUser!: User | null;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  /**
   * Performs some general actions right after the constructor
   */
  ngOnInit(): void {
    this.user$.subscribe((user) => {
      this.currentUser = user;
    })
  }

  /**
   * Resend the verification email at the given emailaddress
   * 
   * @param user the logged in user
   */
  async resendValidationEmail(user: User) {
    // send a verification email to logged in user
    await this.auth.sendVerificationEmail(user);

    // shows a toast to give user a feed-back on its action
  }

  /**
   * Control the email validation and enhance navigation
   */
  async checkVerifiedEmail() {
    // Made some modifications on user
    if(!this.currentUser?.emailVerified) {
      // show the toast to send feedback
    } else {
      // show the toast to send success feedback
      console.log("Your email have been verified");

      // Redirect the user to account page with a delay
      setTimeout(() => {
        this.router.navigateByUrl('/account');
      }, 5*1000)
    }
  }
}
