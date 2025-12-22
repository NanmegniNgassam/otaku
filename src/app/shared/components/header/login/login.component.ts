
import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastComponent } from '../../toast/toast.component';
import { Toast } from '../../../models/toast';
import AuthService from '../../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    imports: [ToastComponent, ReactiveFormsModule, TranslatePipe],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginComponent implements OnInit {
  @Inject(FormBuilder) private formBuilder!:FormBuilder;
  _isLoginErrors!: boolean;
  _loginForm!: FormGroup;
  _isAuthLoading!:boolean;
  _notification!: Toast | null;
  _errors!: { [name: string]: string };

  constructor(
    protected auth: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {
    this._isLoginErrors = false;
    this._isAuthLoading = false;
    this._notification = null;
    translate.stream("components.login.messages").subscribe((errors) => {
      this._errors = errors;
    })
  }

  /**
   * Performs some actions right after the constructor
   */
  ngOnInit(): void {
    this._loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(50)]]
    }, {
      updateOn: 'change'
    });

    this._loginForm.valueChanges.subscribe(() => {
      this._notification = null;
      this._isLoginErrors = false;
    })
  }

  /**
   * Use the form values to log the user with email-password
   * 
   * @returns none
   */
  async onLogin():Promise<void> {
    this._isAuthLoading = true;
    if(this._isLoginErrors) {
      console.error("Form filling doesn't meet all the requirements");
      this._isAuthLoading = false;
      return;
    }

    try {
      this._isAuthLoading = true;
      await this.auth.login(this._loginForm.value);    

      if(this.router.url === '/sign-in') {
        this.router.navigateByUrl('/account');
      }
    } catch (error: any) {
      if(error.code === "auth/invalid-credential") {
        this._notification = {
          type: 'fail',
          message: this._errors["invalidCredentials"]
        }
      } else if (error.code === "auth/too-many-requests") {
        this._notification = {
          type: 'warning',
          message: this._errors["tooManyRequests"]
        }
      } else {
        this._notification = {
          type: 'warning',
          message: this._errors["unknowError"]
        }
      }
      
      this._isLoginErrors = true;
      console.error("An error occured when logging : ", error.code);
    } finally {
      this._isAuthLoading = false;
    }
  }
}