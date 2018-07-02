import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterStateSnapshot} from '@angular/router';
import {GlobalSharedService} from '../shared/shared.service';
import {IInjectData} from '../shared/shared.interface';
import { CSAService } from './csa.service';
@Component({
  template: `
    <div *ngIf="qnsMeta" class="col-lg-12">
      <div class="col-sm-4">Assignee: {{assignee}}</div>
      <div class="col-sm-4">Service Now Ticket #: {{ticketDO}}</div>
      <app-multistep-wiz [qnsMeta]="qnsMeta" [injectData]="injectData"></app-multistep-wiz>
    </div>
  `,
  providers: [CSAService]
})
export class CSAMainComponent implements OnInit{
  qnsMeta;
  injectData: IInjectData;
  subscription: any;
  psslData: any;
  engagementId;
  assignee;
  ticketDO;

  constructor(private api: GlobalSharedService, private router: Router, private activatedRoute: ActivatedRoute, private _csaService: CSAService) {
    this.subscription = this.api.getData('pssl').subscribe(_psslData => {
      this.psslData = _psslData;
    });
  }
  ngOnInit() {
    this.engagementId = this.activatedRoute.routeConfig.path;
    this.injectData = {
      isViewDisabled: true,
      id: null,
      formId: null,
      canShow: null,
      actionId: null,
      submitBtnlabel: null,
      teamId: null,
      stateId: null,
      customLabels: null,
      customBttns: []
    };
    this._csaService.questionnaire(1, '1064').subscribe(res => {
      this.assignee = res.assigneeName;
      this.ticketDO = res.ticketDO;
      this.qnsMeta = res.questionnaireDO;
    }, err => {
    });
  }
}
