import { Component } from '@angular/core';
import AuthService from '../../services/auth.service';
import { ToastComponent } from "../../components/toast/toast.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [ToastComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  constructor(
    protected auth: AuthService
  ) {
  }

  onDismiss() {
    console.log("Le toast vient d'être fermé");
  }
}
