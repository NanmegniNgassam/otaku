import { Component } from '@angular/core';
import { getAuth, User } from '@angular/fire/auth';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
  _user!: User;

  constructor(
    protected util: UtilsService,
  ) {
  }

  async ngOnInit() {
    this._user = getAuth().currentUser!;
  }
}
