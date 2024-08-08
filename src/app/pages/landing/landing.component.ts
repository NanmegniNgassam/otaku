import { Component } from '@angular/core';
import AuthService from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  constructor(
    protected auth: AuthService
  ) {

  }
}
