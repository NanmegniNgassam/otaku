import { AsyncPipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Router, RouterLink } from '@angular/router';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { Toast } from '../../models/toast';
import AuthService from '../../services/auth.service';

@Component({
    selector: 'app-email-verification',
    imports: [AsyncPipe, RouterLink, TranslateModule, ToastComponent],
    templateUrl: './email-verification.component.html',
    styleUrl: './email-verification.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EmailVerificationComponent implements OnInit {
  user$ = this.auth.user$;
  currentUser!: User | null;
  notification!: Toast | null;
  notificationMessages!: { [name: string] : string };

  constructor(
    private auth: AuthService,
    private router: Router,
    private translate: TranslateService,
  ) {
    // Get i18n notification messages
    translate.stream("pages.emailVerification.notifications").subscribe((messages) => {
      this.notificationMessages = messages;
    })
  }

  /**
   * Performs some general actions right after the constructor
   */
  ngOnInit(): void {
    this.user$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  /**
   * Resend the verification email at the given emailaddress
   * 
   * @param user the logged in user
   */
  async resendValidationEmail(user: User) {
    try {
      // send a verification email to logged in user
      await this.auth.sendVerificationEmail(user);

      // shows a toast to give user a feed-back on its action
      this.notification = {
        type: 'info',
        message: this.notificationMessages['info'],
      }
    } catch(error: any) {
      this.notification = {
        type: 'fail',
        message: this.notificationMessages['fail'],
      }
      console.error(error.code, error.message)
    }
  }

  /**
   * Control the email validation and enhance navigation
   */
  async checkVerifiedEmail() {
    // Refresh the current user data
    await this.currentUser?.reload();

    if(!this.currentUser?.emailVerified) {
      // show the toast to send feedback
      this.notification = {
        type: 'warning',
        message: this.notificationMessages['warning'],
      }
    } else {
      // show the toast to send success feedback
      this.notification = {
        type: 'success',
        message: this.notificationMessages['success'],
      }

      // When validation is successful, generate a notification to inform the user

      // Redirect the user to account page with a delay
      setTimeout(() => {
        this.router.navigateByUrl('/account');
      }, 5*1000)
    }
  }
}
