import {Component, Injector, OnInit} from '@angular/core';
import { CSAService } from '../csa.service';
import { Router } from '@angular/router';
import {DialogsService} from '../../shared/modal/dialogs.service';
import { GlobalSharedService } from '../../shared/shared.service';
import * as Meta from './meta.json';
import { DclWrapperComponent, StepWizComponent } from '../../shared/multistep-wizard/multistep-wrapper.component';
import { IInjectData } from '../../shared/shared.interface';
@Component({
  selector: 'app-csa-actions',
  template: `
    <div *ngIf="modalStepper">
        <app-multistep-wiz [qnsMeta]="qnsMeta" [injectData]="injectData" (stepEvent)="submitQns($event)" 
        (reloadEmit)="reloadQns($event)"></app-multistep-wiz>
    </div>
    <div *ngIf="submitSASucess">
        <div class="submit-screen">
        <img src="assets/img/ic-check-circle.svg"/>
        <h5>Successful</h5>
            <button mat-raised-button color="" (click)="reloadTabContent();" class="cta-2">Go Back</button>
        </div>
    </div>

    <div *ngIf="errOnSubmit">
        <div class="submit-screen">
        <img src="assets/img/error-circle.svg"/>
        <h5>Something went wrong</h5>
        <button mat-raised-button type="submit" color="primary" class="cta-1" (click)="reloadTabContent();">Try Again</button>
        </div>
    </div>
    <div *ngIf="showProgess">
        <div class="submit-spinner">
        <mat-spinner class="centered"></mat-spinner>
        <h4>Processing...</h4>
        </div>
    </div>

    <div *ngIf="noPermission" class="cta-screen">
        <div>
            <img src="assets/img/error-circle.svg"/>
            <div class="clearfix"></div>
            <h4>Forbidden - You don't have permission to access this.</h4>
        </div>
    </div>
  `,
  providers: [CSAService, DialogsService],
  styles: [`
        .showStatus{
            padding: 30px;
        }
    `]
})
export class CSATeamActionsComponent implements OnInit {
    public qnsMeta = <any>Meta;
  id;
  saId;
  camrId;
  saInfo;
  injectData: IInjectData;
  submitSASucess = false;
  modalStepper = true;
  showProgess = false;
  errOnSubmit = false;
  constructor(private injector: Injector,
    private router: Router,
    private _csaService: CSAService,
    private dialogsService: DialogsService,
    private sharedService: GlobalSharedService
) {
  }
  ngOnInit() {
    this.saInfo = {
        id: this.injector.get('id'),
        statusId: this.injector.get('statusId'),
        teamId: this.injector.get('teamId'),
        statusMessage: this.injector.get('statusMessage')
    };

    this.injectData = {
        isViewDisabled: false, // get from summary api
        id: this.saInfo.id,
        formId: 'CSA',
        canShow: true,
        actionId: null,
        submitBtnlabel: 'Update Team Status',
        teamId: this.saInfo.teamId,
        stateId: this.saInfo.statusId,
        customLabels: false,
        customBttns: []
      };
    this._csaService.getComments(
        this.saInfo.id,
        this.saInfo.teamId
      ).subscribe(res => {
            this.qnsMeta.steps[0].group[0].comments = res;
      }, err => {
      });
    this.qnsMeta.steps[0].group[0].questions[0].answers[0] = (this.saInfo.statusId).toString();
  }
  reloadTabContent() {
    this.sharedService.saveData('manageCsaUpdateTabStatus', 'update');
  }
  submitQns(emitObj) {
    this.modalStepper = false;
    this.showProgess = true;
    const filteredObj = emitObj.postBody.filter(function(event){
        return event.questionId === 'teamStatus';
    });
    console.log('filteredObj', filteredObj[0].value);
    // post method
    this._csaService.updateTeamstatus(
      this.saInfo.id,
      emitObj.action,
      this.saInfo.teamId,
      filteredObj[0].value
    ).subscribe(res => {
        this.showProgess = false;
        this.modalStepper = false;
        this.errOnSubmit = false;
        this.submitSASucess = true;
    }, err => {
        this.showProgess = false;
        this.modalStepper = false;
        this.submitSASucess = false;
        this.errOnSubmit = true;
    });
  }

}
