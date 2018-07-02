import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-nav-bar-pagination',
  template: `
    <div class="mat-tab-nav-bar-pagination">
      <div (click)="left()" aria-hidden="true" class="mat-tab-header-pagination mat-tab-header-pagination-before mat-elevation-z4 mat-ripple" mat-ripple="">
        <div class="mat-tab-header-pagination-chevron"></div>
      </div>
      <div class="mat-tab-label-container">
        <ng-content></ng-content>
      </div>
      <div (click)="right()" aria-hidden="true" class="mat-tab-header-pagination mat-tab-header-pagination-after mat-elevation-z4 mat-ripple" mat-ripple="">
        <div class="mat-tab-header-pagination-chevron"></div>
      </div>
    </div>
  `,
  styles: [`
    .mat-tab-nav-bar-pagination {
      display: flex;
      overflow: hidden;
      position: relative;
      flex-shrink: 0;
    }

    .mat-tab-label-container {
      display: flex;
      flex-grow: 1;
      overflow: hidden;
      z-index: 1;
    }

    .mat-tab-header-pagination {
      position: relative;
      display: none;
      justify-content: center;
      align-items: center;
      min-width: 32px;
      cursor: pointer;
      z-index: 2;
    }

    .mat-tab-header-pagination-before,
    .mat-tab-header-pagination-after {
      padding-left: 4px;
    }

    .mat-tab-header-pagination {
      display: flex;
    }

    .mat-tab-header-pagination-chevron {
      border-color: rgba(0, 0, 0, 0.87);
    }

    .mat-tab-header-pagination-chevron {
      border-style: solid;
      border-width: 2px 2px 0 0;
      content: '';
      height: 8px;
      width: 8px;
    }

    .mat-tab-header-pagination-before .mat-tab-header-pagination-chevron {
      transform: rotate(-135deg);
    }

    .mat-tab-header-pagination-after .mat-tab-header-pagination-chevron {
      transform: rotate(45deg);
    }


  `],
})
export class NavBarPaginationComponent {

  constructor(
    private el: ElementRef,
  ) {
  }

  left() {
    const el = this.el.nativeElement.querySelector('.mat-tab-label-container');
    el.scrollLeft -= 100;
  }

  right() {
    const el = this.el.nativeElement.querySelector('.mat-tab-label-container');
    el.scrollLeft += 100;
  }

}
/*TODO: This component is a workaround for nav bar pagination. Remove once material supports this*/
