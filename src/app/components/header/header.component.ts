import { Component, CUSTOM_ELEMENTS_SCHEMA, Host, HostListener, OnInit } from '@angular/core';
import { SignInLinksComponent } from "../sign-in-links/sign-in-links.component";
import { SignOutLinksComponent } from "../sign-out-links/sign-out-links.component";
import { MAX_MOBILE_SCREEN_WIDTH } from '../../../configs/screen-sizes';
import { TranslateModule } from '@ngx-translate/core';
import { LoginComponent } from "../login/login.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SignInLinksComponent, SignOutLinksComponent, TranslateModule, LoginComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderComponent implements OnInit {
  isUserConnected:boolean = false;
  isNavMenuOpen!:boolean;

  ngOnInit ():void {
    // Decide to defaultly show nav links or not according to screen size 
    this.setNavLinksDisplay(window.innerWidth);
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
   * Shows the navigation links
   */
  openNavMenu ():void {
    this.isNavMenuOpen = true;
  }
  /**
   * Hides the navigation links
   */
  closeNavMenu ():void {
    this.isNavMenuOpen = false;
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
