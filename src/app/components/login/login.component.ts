import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

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
    private formBuilder: FormBuilder
  ) {
    this._isLoginErrors = false;
  }

  ngOnInit(): void {
    this._loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]]
    }, {
      updateOn: 'change'
    });

    this._loginForm.valueChanges.subscribe(() => {
      this._isLoginErrors = false;
    })
  }

  async onLogin():Promise<void> {
    if(this._isLoginErrors) {
      console.log("Le remplissage du formulaire n'est pas conforme");
      return;
    }

    this._isLoginErrors = true;
    console.log("Le remplissage du formulaire est valide, nous initions la connexion : ", this._loginForm.value);
    
  }

  async onLoginWithGoogle(): Promise<void> {
    console.log('Login attempt with google');
  }
}
