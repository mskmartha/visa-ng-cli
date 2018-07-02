import {Component, Injector, OnInit} from '@angular/core';
import { KCCService } from '../kcc.service';
import { Router } from '@angular/router';
import {DialogsService} from '../../shared/modal/dialogs.service';
import { GlobalSharedService } from '../../shared/shared.service';
import { UtilsService } from '../../shared/utils.service';
import { IInjectData } from '../../shared/shared.interface';
import { DclWrapperComponent, StepWizComponent } from '../../shared/multistep-wizard/multistep-wrapper.component';
@Component({
  selector: 'app-ppr-pir',
  template: `
  <div *ngIf="(hasPermission || readOnly) && modalStepper">
    <!-- {{injectData | json}} -->
    <app-multistep-wiz *ngIf="qnsMeta" [qnsMeta]="qnsMeta" [injectData]="injectData" (stepEvent)="submitQns($event)" 
    (reloadEmit)="reloadQns($event)"></app-multistep-wiz>
    <!--<div>{{saInfo | json}}</div>-->
  </div>
  <div *ngIf="submitSASucess">
    <div class="submit-screen">
      <img src="assets/img/ic-check-circle.svg"/>
      <h5>Successful</h5>
        <button mat-raised-button color="" (click)="showPprPir();" class="cta-2">Go Back</button>
    </div>
  </div>

  <div *ngIf="errOnSubmit">
    <div class="submit-screen">
      <img src="assets/img/error-circle.svg"/>
      <h5>Something went wrong</h5>
      <button mat-raised-button type="submit" color="primary" class="cta-1" (click)="showPprPir();">Try Again</button>
    </div>
  </div>
  <div *ngIf="showProgess">
    <div class="submit-spinner">
      <mat-spinner class="centered"></mat-spinner>
      <h4>Processing...</h4>
    </div>
  </div>

  <div *ngIf="!readOnly && !hasPermission && !showProgess && !errOnSubmit" class="cta-screen">
      <div>
          <img src="assets/img/error-circle.svg"/>
          <div class="clearfix"></div>
          <h4>Forbidden - You don't have permission to access this.</h4>
      </div>
  </div>

  `,
  providers: [KCCService, DialogsService, UtilsService]
})
export class KCCPprPirComponent implements OnInit {
  public qnsMeta;
  id;
  saId;
  camrId;
  key;
  saInfo;
  kccActnsMap;
  public utils: UtilsService;
  injectData: IInjectData;
  submitSASucess = false;
  modalStepper = false;
  showProgess = true;
  errOnSubmit = false;
  private noPermission;
  private hasPermission;
  private readOnly;
  constructor(private injector: Injector,
    private router: Router,
    private _kccService: KCCService,
    private dialogsService: DialogsService,
    private sharedService: GlobalSharedService,
    private utilService: UtilsService
) {
    this.utils = utilService;
  }

  ngOnInit() {
    this.showProgess = true;
    this.saInfo = {
      id: this.injector.get('id'),
      statusId: this.injector.get('statusId'),
      teamId: this.injector.get('teamId'),
      pmm: this.injector.get('pmm'),
      formId: this.injector.get('formId'),
      isViewDisabled: this.injector.get('isViewDisabled')
    };
    this.kccActnsMap = this.utils.kccActions();
    this._kccService.getPIRPPRQns(this.saInfo.id, this.saInfo.formId).subscribe(res => {
      const headers = res.headers;
      const data = res.text().length > 0 ? res.json() : null;
      // this.hasPermission = this.utils.getHttpHeader(res, 'x-permission');
      console.log('x-permission', headers.get('x-permission'));
      if (headers.get('x-permission') === '1') {
        this.hasPermission = true;
      }
      if (headers.get('x-permission') === '2') {
        this.readOnly = true;
      }

      this.injectData = {
        isViewDisabled: (this.readOnly) ||
              (this.saInfo.statusId === 5 || this.saInfo.statusId === 7) ? true : false, // get from summary api
        id: this.saInfo.id,
        formId: this.saInfo.formId,
        canShow: (this.saInfo.statusId === 8 ||
          this.saInfo.statusId === 5 ||
          this.saInfo.statusId === 7 ||
          this.saInfo.statusId === 9) ? true : false, // do not show when KCC is submitted state
        actionId: 12,
        submitBtnlabel: null,
        teamId: null,
        stateId: null,
        customLabels: true,
        customBttns: [
              {
                buttonId: 1,
                buttonTxt: 'Save',
                action: 10,
                class: 'cta-1',
                canShow: this.hasPermission ? true : false,
                enableOnFormDirty: true
              },
              {
                buttonId: 2,
                buttonTxt: 'Re-Submit For Review',
                action: 12,
                class: 'cta-1',
                canShow: (this.hasPermission && this.saInfo.statusId === 9) ? true : false,
                enableOnFormDirty: false
              }
          ]
      };
        this.qnsMeta = data;
        this.showProgess = false;
        this.errOnSubmit = false;
        this.submitSASucess = false;
        this.modalStepper = true;
    }, err => {
        this.showProgess = false;
        this.modalStepper = false;
        this.submitSASucess = false;
        this.noPermission = false;
        this.errOnSubmit = true;
    });
  }
  public openDialog(id?: number, camrId?: number, actionId?: number, pmm?: boolean, isViewDisabled?: boolean, currentStatus?: number) {
    // console.log(id);
    // modal window config
  }
  
  showPprPir() {
    this.sharedService.saveData('manageKccUpdateTabStatus', 'update');
  }
  reloadQns(val) {
    
  }
  submitQns(emitObj) {
    this.modalStepper = false;
    this.showProgess = true;
    console.log('KCC submit', emitObj);
    if (emitObj.postBody.length === 0) {
        // patch method
        this._kccService.updateKCCstatus(this.saInfo.id, emitObj.action, this.saInfo.formId)
        .subscribe((statusChangedData) => {
            this.showProgess = false;
            this.modalStepper = false;
            this.errOnSubmit = false;
            this.noPermission = false;
            this.submitSASucess = true;
            // this.tabStatusEvent.next(this.saInfo.formId);
        }, err => {
            this.showProgess = false;
            this.modalStepper = false;
            this.submitSASucess = false;
            this.noPermission = false;
            this.errOnSubmit = true;
        });

    }else {
      // post method
      this._kccService.postPprPir(
        this.saInfo.formId,
        emitObj.action,
        JSON.stringify({'id': this.saInfo.id || 0, 'questionsResponseDOs': emitObj.postBody})
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
}
