
import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs/Rx';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  authorizedUser = false;
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const authenticated = this.authService.isAuthenticated();
    const subject = new Subject<boolean>();
    authenticated.subscribe(
      (res) => {
        console.log('onNext guard: ' + res);
        this.authorizedUser = res;
        if (!res && state.url !== '/request-access') {
          console.log('redirecting to request access');
          this.router.navigate(['']);
          subject.next(false);
        } else {
          subject.next(true);
        }
        subject.next(this.authorizedUser);
      });
    if (!this.authorizedUser) {
      return subject.asObservable().first();
    } else {
      return true;
    }
  }
}
