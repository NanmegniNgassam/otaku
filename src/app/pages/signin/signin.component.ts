import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import AuthService from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ TranslateModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent implements OnInit {
  _signinForm!:FormGroup;
  _showPassword!:boolean;
  _showPasswordConfirm!:boolean;
  _passwordLevel!: number;
  _signinErrors: string[] = [];
  _isAuthLoading!: boolean;
  protected PASSWORD_LEVELS = ['very-low', 'low', 'medium', 'high', 'excellent'];
  _weakPasswordError!: string;
  _nonIdenticalPasswords!: string;

  constructor(
    private formBuilder: FormBuilder,
    protected auth: AuthService,
    private translate: TranslateService
  ) {
    this._showPassword = false;
    this._showPasswordConfirm = false;
    this._passwordLevel = 0;
    this._isAuthLoading = false;
    translate.stream("pages.signin.errors").subscribe((signinErrors) => {
      let {weakPassword , unidenticalPassword } = signinErrors;
      this._weakPasswordError = weakPassword;
      this._nonIdenticalPasswords = unidenticalPassword;
    })
  }

  /**
   * Initialize current component
   */
  ngOnInit(): void {
    this._signinForm = this.formBuilder.group({
      signinEmail: [null, [Validators.required, Validators.email]],
      signinNickName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      signinPassword: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
      signinPasswordConfirm: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
      generalConditions: [false, Validators.requiredTrue]
    }, {
      updateOn: 'change'
    });

    this._signinForm.valueChanges.subscribe(() => {
      this._signinErrors = [];
      if(this._signinForm.value.signinPassword) {
        this._passwordLevel = this.generatePasswordStrength(this._signinForm.value.signinPassword);
      }
    })
  }

  /**
   * Create a user account
   */
  async onSignin(): Promise<void> {
    this._isAuthLoading = true;
    if(this._signinForm.value.signinPassword === this._signinForm.value.signinPasswordConfirm && this._passwordLevel >= 3) {
      try {
        await this.auth.createAccount(this._signinForm.value);
      } catch(error : any) {
        console.error(error.message);
        this._signinErrors.push(error.code);
      } finally {
        this._isAuthLoading = false;
      }
    } else {
      if(this._passwordLevel < 3) {
        this._signinErrors.unshift(this._weakPasswordError);
      }
      if(this._signinForm.value.signinPassword !== this._signinForm.value.signinPasswordConfirm) {
        this._signinErrors.unshift(this._nonIdenticalPasswords);
      }
      
      this._isAuthLoading = false;
      return;
    }
  }

  /**
   * generate the strength value for a given password according to criteria
   * - at least 8 characters
   * - includes at least 1 figure
   * - includes at least 1 special character
   * - includes at least 1 uppercase
   * 
   * @param password string to evaluate
   * @returns the estimated password strength (between 0 and 4)
   */
  generatePasswordStrength(password: string): number {
    let passwordStrength: number = 0;
    const specialCharRegex = /[^A-Za-z0-9]/;
    const upperCaseRegex = /[A-Z]/;

    // Control the password length
    password.length >= 8 && passwordStrength++;

    // Look for at least one special character
    specialCharRegex.test(password) && passwordStrength++;
    
    // Look for at least one figure
    password.split('')
      .map((digit: string) => Number.isInteger(Number(digit)))
      .some((result) => result) 
    && passwordStrength++;

    // Look for at least one uppercase
    password.split('')
      .map((digit: string) => upperCaseRegex.test(digit))
      .some((result) => result)
    && passwordStrength++;

    return Math.min( Math.max(passwordStrength, 0), 4);
  }

  /**
   * Shows/hides the current password value
   */
  toggleShowPassword():void {
    this._showPassword = !this._showPassword;
  }
  /**
   * Shows/hides the current password confirmation value
   */
  toggleShowPasswordConfirm():void {
    this._showPasswordConfirm = !this._showPasswordConfirm;
  }
}