import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import { HttpClient } from '../shared/http.client';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {UserInfoService} from '../userinfo.service';
import {Constants} from '../Constants/constants';

@Injectable()
export class AuthService {
  // public currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  private authorizedUser = false;
  authorizationSubject = new BehaviorSubject(false);
  constructor(private http: HttpClient, private _userInfoService: UserInfoService) {}

  isAuthenticated(): Observable<boolean> {
    const subject = new Subject<boolean>();
    if(this.authorizedUser) {
      subject.next(true);
      this.authorizationSubject.next(true);
    } else {
      this._userInfoService.getUserDetails().subscribe((res) => {
        const userName = res.user.split('\\')[1];
        this._userInfoService.getDetailedUserInfo(userName).subscribe((user) => {
          Constants.authorizedUserRoles.forEach((userRole) => {
            if (user.roles.indexOf(userRole) >=0) {
              this.authorizedUser = (user.roles.indexOf(userRole) >=0);
              return;
            }
          });
          this.authorizationSubject.next(this.authorizedUser);
          subject.next(this.authorizedUser);
        });
      });
    }
    return subject.asObservable().first();
  }
}
