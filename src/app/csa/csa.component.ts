import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  template: '<router-outlet></router-outlet>',
  providers: []
})
export class CSAComponent {
  constructor(private router: Router) {
  }
}
