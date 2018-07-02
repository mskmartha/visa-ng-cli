import {Component, NgModule, Inject, ViewChild, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { CSAService } from '../csa.service';
import { DclWrapperComponent, StepWizComponent } from '../../shared/multistep-wizard/multistep-wrapper.component';
import * as Meta from './meta.json';
import {Observable, Subject} from 'rxjs/Rx';
import {CSATeamActionsComponent} from './csa-team-actions.component';
@Component({
  selector: 'app-csa-team',
  template: `
    <div *ngIf="modalStepper">
      <dynamic-component [componentData]="componentData"></dynamic-component>
      
      <!--
      teamId: {{model.data.teamId}}
      model:{{model | json}}
      {{teams | async | json }}
      -->
      
    </div>
    <div *ngIf="submitSASucess">
      <div class="submit-screen">
        <img src="assets/img/ic-check-circle.svg"/>
        <h5>Successful</h5>
          <button mat-raised-button color="" (click)="refreshStatus()" class="cta-2">Go Back</button>
      </div>
    </div>
    
    <div *ngIf="errOnSubmit">
      <div class="submit-screen">
        <img src="assets/img/error-circle.svg"/>
        <h5>Something went wrong</h5>
        <button mat-raised-button type="submit" (click)="refreshStatus()" color="primary" class="cta-1">Try Again</button>
      </div>
    </div>
    <div *ngIf="showProgess">
      <div class="submit-spinner">
        <mat-spinner class="centered"></mat-spinner>
        <h4>Processing...</h4>
      </div>
    </div>

  `,
  providers: [CSAService],
  styles: [`
      .submit-screen{
          width: 100%;
          text-align: center;
          padding:50px;
      }
      .submit-screen h5{
          padding: 20px;
      }
      .submit-spinner{
          text-align: center;
          padding: 50px;
      }
  `]
})
export class CSATeamComponent implements OnInit {
  @Output() tabStatusEvent = new EventEmitter();
  submitSASucess = false;
  modalStepper = true;
  showProgess = false;
  errOnSubmit = false;
  @Input() model: any;
  public submitted: boolean;
  public events: any[] = [];
  //
  componentData = null;
  constructor(private _csaService: CSAService ) {
  }
  ngOnInit() {
    this.componentData = {
        component: CSATeamActionsComponent,
        inputs: {
            id: this.model.data.id,
            teamId: this.model.data.teamId,
            statusId: this.model.data.stateId,
            statusMessage: this.model.data.statusMessage
        }
    };
  }
  submitQns(emitObj) {
    this.modalStepper = false;
    this.showProgess = true;
    const filteredObj = emitObj.postBody.filter(function(event){
        return event.questionId === 'teamStatus';
    });
    // console.log('filteredObj', filteredObj[0].value);
    // post method
    this._csaService.updateTeamstatus(
      this.model.data.id,
      emitObj.action,
      this.model.data.teamId,
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
  refreshStatus() {
    this.showProgess = false;
    this.modalStepper = true;
    this.errOnSubmit = false;
    this.submitSASucess = false;
    this.tabStatusEvent.next(this.model.data.teamId);
  }
}
