import { Component, CUSTOM_ELEMENTS_SCHEMA, Host, HostListener, inject, OnInit } from '@angular/core';
import { SignInLinksComponent } from "../sign-in-links/sign-in-links.component";
import { SignOutLinksComponent } from "../sign-out-links/sign-out-links.component";
import { MAX_MOBILE_SCREEN_WIDTH } from '../../../configs/screen-sizes';
import { TranslateModule } from '@ngx-translate/core';
import { LoginComponent } from "../login/login.component";
import { RouterLink, RouterLinkActive } from '@angular/router';
import AuthService from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, SignInLinksComponent, SignOutLinksComponent, TranslateModule, LoginComponent, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderComponent implements OnInit {
  isNavMenuOpen!:boolean;
  auth: AuthService = inject(AuthService);
  user$ = this.auth.user$;


  ngOnInit ():void {
    // Decide to defaultly show nav links or not according to screen size 
    this.setNavLinksDisplay(window.innerWidth);
    this.user$.subscribe((user) => {
      if(user !== null) {
        console.log("Current user : ", user)
      }
    })
  }

  /**
   * Setting up a resize listener that update the UI according to device width
   * 
   * @param event: the event associated to the screen resizing 
   */
  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.setNavLinksDisplay(event.currentTarget.innerWidth);
  }

  /**
   * Toggle the navigation links
   */
  openNavMenuDisplay ():void {
    this.isNavMenuOpen = !this.isNavMenuOpen;
  }
  /**
   * Decides whether or not the navigation links should be shown/hidden
   * 
   * @param deviceScreenWidth the screen size of the current device 
   */
  setNavLinksDisplay (deviceScreenWidth:number):void  {
    this.isNavMenuOpen = !(deviceScreenWidth < MAX_MOBILE_SCREEN_WIDTH)
  }
}
