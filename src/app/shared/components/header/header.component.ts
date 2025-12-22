import { AsyncPipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoginComponent } from './login/login.component';
import { SignInLinksComponent } from "./sign-in-links/sign-in-links.component";
import { SignOutLinksComponent } from "./sign-out-links/sign-out-links.component";
import AuthService from '../../../core/services/auth.service';
import { MAX_MOBILE_SCREEN_WIDTH } from '../../../../configs/screen-sizes';

@Component({
    selector: 'app-header',
    imports: [AsyncPipe, SignInLinksComponent, SignOutLinksComponent, TranslateModule, LoginComponent, RouterLink, RouterLinkActive],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderComponent implements OnInit {
  isNavMenuOpen!:boolean;
  user$ = this.auth.user$;

  constructor(
    private auth: AuthService,
  ) {
  }

  /**
   * Performs some actions right after the constructor
   */
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
  toggleNavMenuDisplay ():void {
    this.isNavMenuOpen = !this.isNavMenuOpen;
  }
  /**
   * Decides whether or not the navigation links should be shown/hidden
   * 
   * @param deviceScreenWidth the screen size of the current device 
   */
  setNavLinksDisplay (deviceScreenWidth:number):void  {
    this.isNavMenuOpen = (deviceScreenWidth >= MAX_MOBILE_SCREEN_WIDTH)
  }
}
