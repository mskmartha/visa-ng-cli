import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../shared/utils.service';
import {UserInfoService} from '../userinfo.service';
import {Constants} from '../Constants/constants';
@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  public utils: UtilsService;
  detailedUserInfo: any = {};
  admin = false;
  constructor(private _userInfoService: UserInfoService,
              private router: Router,
              private utilService: UtilsService) {
    this.utils = utilService;
    this.router.events.subscribe(event => {
      if (event.constructor.name === 'NavigationStart') {
        // this.loadingComponent = true;
      }
    });

  }
  ngOnInit() {
    this._userInfoService.getUserDetails().subscribe((res) => {
      const userName = res.user.split('\\')[1];
      this._userInfoService.getDetailedUserInfo(userName).subscribe((user) => {
        this.detailedUserInfo = user;
        Constants.authorizedUserRoles.forEach((userRole) => {
          if (user.roles.indexOf(userRole) >=0) {
            this.admin = user.roles.indexOf(userRole) >=0;
            return;
          }
        });
      });
    });

  }
  goToSLAP() {
    this.router.navigateByUrl('/dashboard');
    window.open(
      'https://' + window.location.hostname + ':8443/#/',
      '_blank'
    );
  }
}
