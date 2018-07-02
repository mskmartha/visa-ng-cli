/* tslint:disable:all */
import {Inject, Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Subject, BehaviorSubject} from 'rxjs';
@Injectable()
export class NavigationService {
  public static smallViewportWidth: number = 600;
  public static largeViewportWidth: number = 992;

  private _windowSize: Subject<number> = new BehaviorSubject(NavigationService.largeViewportWidth);
  private _openSidenavStyle: Subject<string> = new BehaviorSubject('side');
  private _closedSidenavStyle: Subject<string> = new BehaviorSubject('icon overlay');
  private _sidenavOpened: Subject<boolean> = new BehaviorSubject(this.largeScreen);
  private _fixedNavbar: Subject<boolean> = new BehaviorSubject(false);

  constructor(public dialog: MatDialog) {

    let style: string = localStorage.getItem('sidenavOpened');

    this._sidenavOpened.next(style === 'true');

  }

  public get windowSize(): Subject<number> {
    return this._windowSize;
  }

  public get openSidenavStyle(): Subject<string> {
    return this._openSidenavStyle;
  }

  public setOpenSidenavStyle(openSidenavStyle: string): void {
    this._openSidenavStyle.next(openSidenavStyle);
  }

  public get closedSidenavStyle(): Subject<string> {
    return this._closedSidenavStyle;
  }

  public setClosedSidenavStyle(closedSidenavStyle: string): void {
    this._closedSidenavStyle.next(closedSidenavStyle);
  }

  public get sidenavOpened(): Subject<boolean> {
    return this._sidenavOpened;
  }

  public setSidenavOpened(sidenavOpened: boolean): void {
    this._sidenavOpened.next(sidenavOpened);
    localStorage.setItem('sidenavOpened', ''+sidenavOpened);
  }

  public get mediumScreenAndDown(): boolean {
    return window !== undefined ? window.matchMedia(`(max-width: ${NavigationService.largeViewportWidth}px)`).matches : false;
  }

  public get mediumScreenAndUp(): boolean {
    return window !== undefined ? window.matchMedia(`(min-width: ${NavigationService.smallViewportWidth}px)`).matches : false;
  }

  public get smallScreen(): boolean {
    return window !== undefined ? window.matchMedia(`(max-width: ${NavigationService.smallViewportWidth}px)`).matches : false;
  }

  public get mediumScreen(): boolean {
    return window !== undefined ? (!this.smallScreen && !this.largeScreen) : false;
  }

  public get largeScreen(): boolean {
    return window !== undefined ? window.matchMedia(`(min-width: ${NavigationService.largeViewportWidth}px)`).matches : false;
  }

  private static viewport(): ViewPort {
    if(!window) {
      return {width : this.smallViewportWidth, height : 500};
    }
    let e: any = window;
    let a: string = 'inner';
    if(!('innerWidth' in window )) {
      a = 'client';
      e = document.documentElement || document.body;
    }
    return {width : e[a + 'Width'], height : e[a + 'Height']};
  }

}

interface ViewPort {
  width: number;
  height: number;
}
