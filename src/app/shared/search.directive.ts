import { Directive, HostListener } from '@angular/core';

/**
* Allows the sidebar to be toggled via click.
*/
@Directive({
  selector: '.search-toogler',
})
export class SearchTooglerDirective {
  constructor() { }

  @HostListener('click', ['$event'])
  toggleOpen($event:any) {
    $event.preventDefault();
    document.querySelector('body').classList.toggle('search-open');
  }
}


export const SIDEBAR_TOGGLE_DIRECTIVES = [SearchTooglerDirective];
