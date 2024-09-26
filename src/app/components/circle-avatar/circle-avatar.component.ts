import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-circle-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './circle-avatar.component.html',
  styleUrl: './circle-avatar.component.scss'
})
export class CircleAvatarComponent {
  @Input() avatarUrl!:string;
  @Input() userName!:string;

  constructor(
    protected util: UtilsService
  ) {
  }
}
