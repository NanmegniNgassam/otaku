import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

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

  constructor(
    private formBuilder: FormBuilder
  ) {
    this._showPassword = false;
    this._showPasswordConfirm = false;
  }

  ngOnInit(): void {
    this._signinForm = this.formBuilder.group({
      signinEmail: [null, [Validators.required, Validators.email]],
      signinPassword: [null, Validators.required],
      signinPasswordConfirm: [null, Validators.required],
      generalConditions: [false, Validators.requiredTrue]
    }, {
      updateOn: 'change'
    });

    this._signinForm.valueChanges.subscribe(() => {
    })
  }

  async onSignin(): Promise<void> {
    console.log(this._signinForm.errors);
    console.log("Validation du formulaire : ", this._signinForm.value)
    
  }

  toggleShowPassword():void {
    this._showPassword = !this._showPassword;
  }
  toggleShowPasswordConfirm():void {
    this._showPasswordConfirm = !this._showPasswordConfirm;
  }
}
