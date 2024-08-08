import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import AuthService from '../../services/auth.service';
import { OAuthCredential } from '@angular/fire/auth';
import { Router } from '@angular/router';

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

  constructor(
    private formBuilder: FormBuilder,
    protected auth: AuthService,
    private router: Router
  ) {
    this._isLoginErrors = false;
  }

  /**
   * Initialize current component
   */
  ngOnInit(): void {
    this._loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(25)]]
    }, {
      updateOn: 'change'
    });

    this._loginForm.valueChanges.subscribe(() => {
      this._isLoginErrors = false;
    })
  }

  /**
   * Use the form values to log the user
   * 
   * @returns none
   */
  async onLogin():Promise<void> {
    if(this._isLoginErrors) {
      console.error("Form filling doesn't meet all the requirements");
      return;
    }

    try {
      await this.auth.login(this._loginForm.value);    
      
      this.router.navigateByUrl('/');
    } catch (error: any) {
      this._isLoginErrors = true;
      console.error("An error occured when logging : ", error.code);
    }
  }
}
