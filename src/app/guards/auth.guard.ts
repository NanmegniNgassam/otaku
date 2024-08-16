import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import AuthService from '../services/auth.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private _auth: AuthService,
    private _router:Router
  ) {}

  /**
   * Check if there's a signed in user during navigation
   * 
   * @returns An Observable on Signin User from associated service
   */
  canActivate() {
    return this._auth.user$.pipe(
      map((user) => {
        if(!user) {
          return this._router.navigateByUrl('/sign-in');
        } 
        return true;
      })
    )
  }
}

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard {
  constructor(
    private _auth: AuthService,
    private _router:Router
  ) {}

    /**
   * Check if there's no signed in user during navigation
   * 
   * @returns An Observable on Signin User from associated service
   */
    canActivate() {
      return this._auth.user$.pipe(
        map((user) => {
          if(user) {
            return this._router.navigateByUrl('/account');
          } 
          return true;
        })
      )
    }
}
