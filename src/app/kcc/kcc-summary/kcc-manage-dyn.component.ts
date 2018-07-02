import {Component, NgModule, Inject, ViewChild, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { KCCService } from '../kcc.service';
import {NgForm, FormsModule, ReactiveFormsModule, FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DclWrapperComponent, StepWizComponent } from '../../shared/multistep-wizard/multistep-wrapper.component';
import {Observable, Subject} from 'rxjs/Rx';
import {KCCPprPirComponent} from './kcc-ppr-pir.component';
import { IInjectData } from '../../shared/shared.interface';
@Component({
  selector: 'app-manage-kcc',
  template: `
      <dynamic-component [componentData]="componentData"></dynamic-component>
      <!--
      {{model | async | json }}
      -->
  `,
  providers: [KCCService],
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
export class KccManageDynComponent implements OnInit {
  @Output() tabStatusEvent = new EventEmitter();
  injectData: IInjectData;
  @Input() model: Observable<any>;
  public submitted: boolean;
  public events: any[] = [];
  //
  public postQsMap: any = {};
  public editCSA;
  public teamForm: FormGroup;
  loadNow;
  qnsMeta;
  componentData = null;
  constructor(private fb: FormBuilder, private _kccService: KCCService ) {
  }
  ngOnInit() {
    this.model.subscribe(model => {
      this.componentData = {
          component: KCCPprPirComponent,
          inputs: {
              id: model.id,
              teamId: model.teamId,
              statusId: model.statusId,
              isViewDisabled: model.isViewDisabled,
              formId: model.formId,
              pmm: true
          }
      };

      this.injectData = {
        isViewDisabled: model.isViewDisabled, // get from summary api
        id: model.id,
        formId: model.type,
        canShow: null,
        actionId: null,
        submitBtnlabel: 'Update Team Status',
        teamId: null,
        stateId: model.statusId,
        customLabels: false,
        customBttns: []
      };
    });
  }
}
