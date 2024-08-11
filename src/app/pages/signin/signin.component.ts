import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
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
  protected PASSWORD_LEVELS = ['very-low', 'low', 'medium', 'excellent'];

  constructor(
    private formBuilder: FormBuilder,
    protected auth: AuthService
  ) {
    this._showPassword = false;
    this._showPasswordConfirm = false;
    this._passwordLevel = 0;
  }

  /**
   * Initialize current component
   */
  ngOnInit(): void {
    this._signinForm = this.formBuilder.group({
      signinEmail: [null, [Validators.required, Validators.email]],
      signinNickName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      signinPassword: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(25)]],
      signinPasswordConfirm: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(25)]],
      generalConditions: [false, Validators.requiredTrue]
    }, {
      updateOn: 'change'
    });

    this._signinForm.valueChanges.subscribe(() => {
      this._signinErrors = [];
      this._passwordLevel = this.evaluatePasswordStrength(this._signinForm.value.signinPassword);
    })
  }

  /**
   * Create a user account
   */
  async onSignin(): Promise<void> {
    if(this._signinForm.value.signinPassword === this._signinForm.value.signinPasswordConfirm) {
      try {
        await this.auth.createAccount(this._signinForm.value);
      } catch(error : any) {
        console.error(error.message);
        this._signinErrors.push(error.message);
      }
    } else {
      this._signinErrors.push("Les mots de passes utilisés ne sont pas identiques !");
      return;
    }
  }

  // TODO: Create a specific enum
  // must return the strenght and recommanded improvements
  evaluatePasswordStrength(password: string): number {
    let passwordStrength: number = 0;
    const specialCharRegex = /[^A-Za-z0-9]/;

    // length
    password.length >= 8 && passwordStrength++;

    // special character
    specialCharRegex.test(password) && passwordStrength++;
    

    // at least one figure
    password.split('')
      .map((digit: string) => Number.isInteger(Number(digit)))
      .some((result) => result) 
    && passwordStrength++;

    // at least one capital letter
    password.split('')
      .map((digit: string) => !Number.isInteger(Number(digit)) && digit === digit.toUpperCase())
      .some((result) => result)
    && passwordStrength++;

    return Math.min( Math.max(passwordStrength, 0), 3);
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