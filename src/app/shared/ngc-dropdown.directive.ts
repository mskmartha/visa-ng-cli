import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '.ngc-dropdown',
  host: {
    '[class.open]': '_open',
  }
})
export class NgcDropdownDirective {

  private _open = false;

  isOpen() { return this._open; }

  open() {
    this._open = true;
  }

  close() {
    this._open = false;
  }

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }
}

@Directive({
  selector: '.ngc-dropdown-toggle',
})
export class NgcDropdownToggleDirective{
  constructor(private dropdown: NgcDropdownDirective) {}

  @HostListener('click', ['$event'])
  toggleOpen($event:any) {
    $event.preventDefault();
    this.dropdown.toggle();
  }
}

export const NAV_DROPDOWN_DIRECTIVES = [NgcDropdownToggleDirective, NgcDropdownDirective];

