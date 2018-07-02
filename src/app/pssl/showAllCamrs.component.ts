import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector : 'app-show-all-camrs',
  templateUrl : './showAllcamrs.component.html',
})
export class ShowAllCamrsComponent implements OnInit {
    @Input() model: any;
    constructor() {
    }
    ngOnInit() {
    }
}
