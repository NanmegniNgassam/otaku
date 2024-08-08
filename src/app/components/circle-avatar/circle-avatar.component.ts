import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

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

  /**
   * generate from a fullname the derived initials
   * 
   * @param username the name of the current service user
   * @returns the username initials in uppercase (like AW for Alex Wilcox)
   */
  generateNameInitials (username:string):string {
    let initials = '';
    const [firstName, lastName] = username.split(' ');

    
    initials+= firstName && firstName[0];
    initials+= lastName ? lastName[0] : '';

    return initials.toUpperCase();
  }
}
