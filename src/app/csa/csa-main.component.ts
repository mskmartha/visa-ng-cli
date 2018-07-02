import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GlobalSharedService} from '../shared/shared.service';
import { CSAService } from './csa.service';
@Component({
  template: `
    <coming-soon></coming-soon>
    Engagement Id: {{engagementId}}
  `,
  providers: [CSAService]
})
export class CSAMainComponent implements OnInit{
  subscription: any;
  psslData: any;
  engagementId;
  constructor(private api: GlobalSharedService, private router: Router, private activatedRoute: ActivatedRoute, private _csaService: CSAService) {
    this.subscription = this.api.getData('pssl').subscribe(_psslData => {
      this.psslData = _psslData;
    });
  }
  ngOnInit() {
    this.engagementId = this.activatedRoute.routeConfig.path;
  }
}
