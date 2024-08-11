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
  _signinErrors!: string[];
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
    })
  }

  /**
   * Create a user account
   */
  async onSignin(): Promise<void> {
    if(this._signinForm.value.signinPassword === this._signinForm.value.signinPasswordConfirm) {
      await this.auth.createAccount(this._signinForm.value);
    } else {
      this._signinErrors.push("Les mots de passes utilisés ne sont pas identiques !");
      return;
    }
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