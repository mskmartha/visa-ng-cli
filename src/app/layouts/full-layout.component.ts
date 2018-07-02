import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, NgZone, OnDestroy, ViewChild, OnChanges } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatSnackBar, MatSidenav } from '@angular/material';
import { GlobalSharedService } from '../shared/shared.service';


import {NavigationService} from '../navigation/navigation.service';
import {HttpClient} from '../shared/http.client';
import {UserInfoService} from '../userinfo.service';
import {EnumsService} from '../shared/enums.service';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {Constants} from '../Constants/constants';

@Component({
    selector: 'app-dashboard',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './full-layout.component.html',
    styleUrls: ['./full-layout.component.scss'],
    providers: [GlobalSharedService, NavigationService, EnumsService]
})

export class FullLayoutComponent implements OnInit, OnChanges , OnDestroy {
    @ViewChild(MatSidenav) sideNav: MatSidenav;
    sidenavStyle = 'side';
    admin = false;
    private sidenavOpened = true;
    private _subscriptions: Subscription[] = [];
    private _sidenavOpened: boolean;
    detailedUserInfo: any = {};
    sidenavOpenStyle: string;

    public item = {
        image: {url: ''}
    };
    subscription: any;
    userName: any;
    enums: any;
    // AB: Used for sidenav detailed view on hover
    showDetail = false;
    // AB: Used for sidenav detailed view on click of the hamburger
    showDetailView = false;

    constructor( private _userInfoService: UserInfoService, public _http: HttpClient,
                 public navigation: NavigationService, private api: GlobalSharedService,
                 private cdr: ChangeDetectorRef, ngZone: NgZone,
                 private _enumsService: EnumsService, private sharedService: GlobalSharedService,
                 private router: Router, public snackBar: MatSnackBar) {
      this.subscription    = this.api.getData('userInfo').subscribe( _sharingData => {
          this.userName = _sharingData;
      });
      this.subscription    = this.api.getData('enums').subscribe( _enumsData => {
          this.enums = _enumsData;
      });
     }

     ngOnDestroy() {
        this._subscriptions.forEach(sub => {
            sub.unsubscribe();
        });
     }

    ngOnInit(): void {
      this._userInfoService.getUserDetails().subscribe((res) => {
        this.userName = res.user.split('\\')[1];
        this.sharedService.saveData('userInfo', this.userName);
        sessionStorage.setItem('currentUser', JSON.stringify({ loggedIn: true, userName: this.userName }));
        sessionStorage.setItem('slToken', res.token);

        const enums = sessionStorage.getItem('enums');
        if (!enums) {
          this._enumsService.loadEnums().subscribe((enumsRes) => {
            this.sharedService.saveData('enums', enumsRes);
            sessionStorage.setItem('enums', JSON.stringify(enumsRes));
            sessionStorage.setItem('userInfo', JSON.stringify(this.userName));
          });
        }
        this._userInfoService.getDetailedUserInfo(this.userName).subscribe((user) => {
          this.detailedUserInfo = user;
          Constants.authorizedUserRoles.forEach((userRole) => {
            if (user.roles.indexOf(userRole) >=0) {
              this.admin = (user.roles.indexOf(userRole) >=0);
              return;
            }
          });
          const departments = sessionStorage.getItem('departments');
          if (!departments) {
            this._enumsService.getDepartments().subscribe((deptRes) => {
              // const depList = this.utils.getDepartments(deptRes);
              const deptId2AbbrMap = new Map();
              deptRes.forEach((dept) => {
                if (dept.id === this.detailedUserInfo.departmentId) {
                  this.detailedUserInfo['department'] = dept.name;
                  sessionStorage.setItem('detailedUserInfo', JSON.stringify(this.detailedUserInfo));
                }
                deptId2AbbrMap.set(dept.id, dept.abbreviation);
              });
              sessionStorage.setItem('departments', JSON.stringify(Array.from(deptId2AbbrMap.entries()).reduce((o, [key, value]) => {
                o[key] = value;
                return o;
              }, {})));
            }, err => {
            });
          }

        });
      });

        this._subscriptions.push(this.navigation.openSidenavStyle.subscribe(style => {
          this.sidenavOpenStyle = style;
        }));
        this._subscriptions.push(this.navigation.sidenavOpened.subscribe(sidenavOpen => {
          this._sidenavOpened = sidenavOpen;
        }));
        let lastWindowSize = 0;
        const combined = Observable.combineLatest(this.navigation.sidenavOpened, this.navigation.openSidenavStyle,
          this.navigation.closedSidenavStyle, this.navigation.windowSize, (opened, openStyle, closedStyle, windowSize) => {
          let screenSizeChange = false;
          if (windowSize !== lastWindowSize) {
            lastWindowSize = windowSize;
            screenSizeChange = true;
          }
          return {opened, openStyle, closedStyle, screenSizeChange};
        });

        this._subscriptions.push(combined.subscribe
            ((p: {opened: boolean, openStyle: string, closedStyle: string, screenSizeChange: boolean}) => {
          if (p.openStyle === 'off') {
            this.sidenavOpened = false;
            this.sidenavStyle = 'over';
            this.sideNav.close();
            return;
          }
          this.sidenavOpened = p.opened;
          if (this.navigation.largeScreen) {
            if ( p.opened) {
              this.sidenavStyle = p.openStyle;
            } else {
              this.sidenavStyle = p.closedStyle;
            }
            if (this.sidenavStyle !== 'off' && (this.sidenavStyle !== 'hidden' || p.opened) && (this.sidenavStyle !== 'push' || p.opened)) {
              this.sideNav.open();
            } else {
              this.sideNav.close();
            }
          } else {
            this.sidenavStyle = 'over';
            if (p.opened && !p.screenSizeChange) {
              this.sideNav.open();
            } else {
              this.sideNav.close();
            }
          }
        }));
        if (this.sidenavStyle === 'hidden' || this.sidenavStyle === 'push') {
          this.sideNav.close(); // Close on initial load
        }
        //  Save the users into the map which is used to get the name form the id
        this._enumsService.getUsers().subscribe((enumsRes) => {
          this.sharedService.saveData('users', enumsRes);
          // sessionStorage.setItem('users', JSON.stringify(enumsRes));
        });
        // Save the generic status
        this._enumsService.loadEnums().subscribe((enumsRes) => {
          this.sharedService.saveData('enums', enumsRes);
          // sessionStorage.setItem('users', JSON.stringify(enumsRes));
        });
      }

      ngOnChanges() {
        this.detailedUserInfo = JSON.parse(sessionStorage.getItem('detailedUserInfo'));

      }
    goToSLAP() {
      this.router.navigateByUrl('/dashboard');
      console.log(window.location);
      window.open(
        'https://' + window.location.hostname  + ':8443/#/',
        '_blank'
      );
    }
    scrollToTop() {
        this.router.events.subscribe((evt) => {
          if (!(evt instanceof NavigationEnd)) {
            return;
          }
          window.scrollTo(0, 0);
        });
      }
}
