import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import AuthService from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginComponent implements OnInit {
  _isLoginErrors!: boolean;
  _loginForm!: FormGroup;
  _isAuthLoading!:boolean;

  constructor(
    private formBuilder: FormBuilder,
    protected auth: AuthService,
    private router: Router
  ) {
    this._isLoginErrors = false;
    this._isAuthLoading = false;
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
      
      this.router.navigateByUrl('/');
    } catch (error: any) {
      this._isLoginErrors = true;
      console.error("An error occured when logging : ", error.code);
    } finally {
      this._isAuthLoading = false;
    }
  }
}

// TODO : Improves the feedback gived when an error occured