import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
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
   * @returns An Observer on Signin User from associated service
   */
  canActivate() {
    return this._auth.user$.pipe(
      map((user) => {
        return (!user) ? this._router.navigateByUrl('/missing-permissions') : true
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
   * @returns An Observer on Signin User from associated service
   */
    canActivate() {
      return this._auth.user$.pipe(
        map((user) => {
          return (user) ? this._router.navigateByUrl('/account') : true;
        })
      )
    }
}

@Injectable({
  providedIn: 'root'
})
export class EmailVerificationGuard {
  constructor(
    private _auth: AuthService,
    private _router:Router
  ) {}

  /**
   * Check if the signedin user had verified its email
   * 
   * @returns An observer on emailVerified field of user
   */
  canActivate() {
    return this._auth.user$.pipe(
      map((user) => {
        return (user?.emailVerified) ? this._router.navigateByUrl('/account') : true;
      })
    )
  }
}