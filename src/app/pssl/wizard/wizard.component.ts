import {Component, Input, OnInit, ElementRef, TemplateRef, Output, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PSSLService } from '../pssl.service';
import { GlobalSharedService } from '../../shared/shared.service';
import { IInjectData } from '../../shared/shared.interface';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {SnackBarErrorComponent} from '../../shared/html-templates/snack-bar.component';
import {MatSnackBar} from '@angular/material';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
@Component({
  selector : 'app-pssl-wizard',
  templateUrl: 'wizard.component.html',
  providers: [PSSLService],
  styles: [`
    :host ::ng-deep .mat-step-icon {
      background-color: #f3a909 !important;
    }
  `]
})
export class PSSLWizardComponent implements OnInit {
  validActionsMap = [20, 1]; // default state ["Start Scoping","Start Triage"]
  validAction;
  qnsMeta;
  isCAMRDisabled = false;
  injectData: IInjectData;
  public selected = [];
  public camrListDos = [];
  public elementRef;
  selectedSaType = 'SA';
  @Input() model: any;
  @Output() closeModalEvent = new BehaviorSubject('cancel');
  // camr
  askCAMR = true;
  public camrForm: FormGroup;
  public submitted: boolean;
  public events: any[] = [];
  //
  public postQsMap: any = {};
  submitSASucess = false;
  modalStepper = false;
  showProgess = false;
  errOnSubmit = false;
  public editPSSL;
  psslMain = 'psslMain';
  ///
  applicationId;
  camrAppName = '';
  // config for autocomplete camr
  autocompleteConfig = {
    url: '/config-services/camrs/search',
    backfillUrl: '/config-services/camr',
    multi: {
      hasPrimary: true,
      primaryValue: null
    }
  }
  saIdSubmitted;
  ////////////////
  isLinear = false;
  selectedIndex = 0;
  intakeStep;
  scopingStep;
  triageStep;
  injectSAIntakeData;
  injectSAScopingData;
  SAIntakeQnsMeta;
  SAScopingQnsMeta;
  SAIntakeTabLoaded = false;
  SAScopingTabLoaded = false;
  saIntakeThenBlock: TemplateRef<any> = null;
  saElseBlock: TemplateRef<any> = null;
  saScopingThenBlock: TemplateRef<any> = null;

  @ViewChild('loadingBlock')
  loadingBlock: TemplateRef<any> = null;
  @ViewChild('errorBlock')
  errorBlock: TemplateRef<any> = null;
  @ViewChild('saIntakeBlock')
  saIntakeBlock: TemplateRef<any> = null;
  @ViewChild('saScopingBlock')
  saScopingBlock: TemplateRef<any> = null;

  constructor(
    private fb: FormBuilder,
    private _psslService: PSSLService,
    private sharedService: GlobalSharedService,
    public snackBar: MatSnackBar,
    myElement: ElementRef
  ) {
    // view pssl prefill camr
    this.elementRef = myElement;
    this.camrForm = this.fb.group({
        camr:  [''],
        multiCamr:  [null, Validators.required]
    });
  }
  ngOnInit() {
    // console.log('this.model', this.model);
    this.validAction = this.validActionsMap.includes(this.model.data.actionId);
    const validActionIndex = this.validActionsMap.indexOf(this.model.data.actionId);
    this.selectedIndex = this.validActionsMap.indexOf(this.model.data.actionId) + 1;
    this.intakeStep = true;
    this.scopingStep = validActionIndex === 1 || validActionIndex === 0;
    this.triageStep = validActionIndex === 1;
    this.injectData = {
      isViewDisabled: (this.model.data.actionId === 23) ? false : this.model.data.isViewDisabled,
      id: null,
      formId: this.model.data.formId,
      canShow: null,
      actionId: this.model.data.actionId,
      submitBtnlabel: null,
      teamId: null,
      stateId: null,
      customLabels: null,
      customBttns: [
        {
          buttonId: 1,
          buttonTxt: 'Need More Info',
          action: 25,
          class: 'cta-1',
          canShow: (this.model.data.actionId === 1) ? true : false,
          enableOnFormDirty: false
        }
      ]
    };

    // view mode
    this.isCAMRDisabled = this.model.data.isViewDisabled;

    switch (this.model.data.actionId) {
        case 6: {
          // View SA
          this.askCAMR = false;
          this.modalStepper = true;
          this.getQuestions('SA', this.model.data.id, this.model.data.applicationId, this.model.data.actionId);
          break;
        }
        case 11: {
          // edit SA
          this.askCAMR = false;
          this.modalStepper = true;
          this.getQuestions('SA', this.model.data.id, this.model.data.applicationId, this.model.data.actionId);
          break;
        }
        case 3: {
          // Clone SA
          this.askCAMR = false;
          this.modalStepper = true;
          // this.getQuestions('SA', 0, this.model.data.applicationId);
          this.getQuestions('SA', this.model.data.id, this.model.data.applicationId, this.model.data.actionId, this.model.data.saType);
          break;
        }
        case 1: {
          // SA triage
          this.askCAMR = false;
          this.modalStepper = true;
          this.getQuestions('SAT', this.model.data.id, this.model.data.applicationId, this.model.data.actionId);
          break;
        }
        case 4: {
          // View SA triage
          this.askCAMR = false;
          this.modalStepper = true;
          this.getQuestions('SAT', this.model.data.id, this.model.data.applicationId, this.model.data.actionId);
          break;
        }
        case 20: {
          // start SA Scoping
          this.askCAMR = false;
          this.modalStepper = true;
          this.getQuestions('SAS', this.model.data.id, this.model.data.applicationId, this.model.data.actionId);
          break;
        }
        case 21: {
          // View Scoping
          this.askCAMR = false;
          this.modalStepper = true;
          this.getQuestions('SAS', this.model.data.id, this.model.data.applicationId, this.model.data.actionId);
          break;
        }
        case 22: {
          // Edit Scoping
          this.askCAMR = false;
          this.modalStepper = true;
          this.getQuestions('SAS', this.model.data.id, this.model.data.applicationId, this.model.data.actionId);
          break;
        }
        case 23: {
          // edit Triage
          this.askCAMR = false;
          this.modalStepper = true;
          this.getQuestions('SAT', this.model.data.id, this.model.data.applicationId, this.model.data.actionId);
          break;
        }
        default: {
            break;
        }
    }
  }
  public selectionChange($event?: StepperSelectionEvent): void {
    /*console.log('stepper.selectedIndex: ' + this.selectedIndex
      + '; $event.selectedIndex: ' + $event.selectedIndex);*/

    // if ($event.selectedIndex == 0) return; // First step is still selected

    this.selectedIndex = $event.selectedIndex;
    switch (this.selectedIndex) {
      case 0: { // SA Intake
        if (this.SAIntakeTabLoaded) {
          return;
        }
        this.saElseBlock = this.loadingBlock;
        this.getQuestionsOnDemand('SA', 6).then((qnsRes) => {
          this.SAIntakeQnsMeta = qnsRes;
          this.injectSAIntakeData = {
            isViewDisabled: true,
            id: null,
            formId: 'scoping',
            canShow: null,
            actionId: 12, // this.model.data.actionId
            submitBtnlabel: null,
            teamId: null,
            stateId: null,
            customLabels: null,
            customBttns: []
          };
          this.SAIntakeTabLoaded = true;
          this.saIntakeThenBlock = this.saIntakeBlock;
        });
        break;
      }
      case 1: {
        // SA Scoping
        if (this.SAScopingTabLoaded) {
          return;
        }
        this.saElseBlock = this.loadingBlock;
        this.getQuestionsOnDemand('SAS', 21).then((qnsRes) => {
          this.SAScopingQnsMeta = qnsRes;
          this.injectSAScopingData = {
            isViewDisabled: true,
            id: null,
            formId: 'scoping',
            canShow: null,
            actionId: 12, // this.model.data.actionId
            submitBtnlabel: null,
            teamId: null,
            stateId: null,
            customLabels: null,
            customBttns: []
          };
          this.SAScopingTabLoaded = true;
          this.saScopingThenBlock = this.saScopingBlock;
        });
        break;
      }
      default: {
        break;
      }
    }
  }
  getQuestionsOnDemand(saType: string, actionId: number) {
    return new Promise((resolve) => {
      this._psslService.questionnaire(saType, this.model.data.id, this.camrListDos, actionId).subscribe(res => {
        resolve(res);
      }, err => {
        this.saElseBlock = this.errorBlock;
      });
    });
  }
  invalidSubmitError() {
    this.snackBar.openFromComponent(SnackBarErrorComponent, {
      duration: 2000,
      data: 'Please select valid CAMR'
    });
  }
  autocompleteEvent(val) {
    // console.log("autocomp emitted arr", val)
    if (!val.autocomplete) {
      this.camrForm.controls['multiCamr'].reset();
    } else {
      // populate camrListDos for every event
      this.camrListDos = val.autocomplete;
      this.applicationId = val.autocomplete[0];
      this.camrForm.controls['multiCamr'].setValue(val.autocomplete);

    }
  }

  saveCAMR(isValid?: boolean) {
      this.submitted = true;
      // console.log(model, isValid);
    this.getQuestions(this.selectedSaType, this.model.data.id || 0, this.applicationId, this.model.data.actionId);
  }
  getQuestions(saType: string, id: number, camr: string, actionId, selectedSaType = '') {
    this.askCAMR = false;
    this.showProgess = true;
    this.modalStepper = false;
    // In case of clone we are passing the value of the SaType as selectedSaType and thus we need to clear the saId and assign saType to create new SA
    if (selectedSaType !== '') {
      this.selectedSaType = selectedSaType;
      this.model.data.id = 0;
    }
    this.saElseBlock = this.loadingBlock;
    this._psslService.questionnaire(saType, id, this.camrListDos, this.model.data.actionId).subscribe(res => {
        // TODO: resize modal
        // this.sharedService.saveData('resizeModal', '80%');
        this.qnsMeta = res;
        if (saType === 'SA') {
          this.SAIntakeTabLoaded = true;
          this.saIntakeThenBlock = this.saIntakeBlock;
        }
        if (saType === 'SAS') {
          this.SAScopingTabLoaded = true;
          this.saScopingThenBlock = this.saScopingBlock;
        }
        this.showProgess = false;
        this.modalStepper = true;
    }, err => {
        this.saElseBlock = this.errorBlock;
        this.showProgess = false;
        this.modalStepper = false;
        this.errOnSubmit = true;
    });
  }
  tryAgain(saType: string) {
    // console.log(saType);
    this.errOnSubmit = false;
    this.askCAMR = false;
    this.modalStepper = false;
    this.showProgess = true;
    this.getQuestions(saType, this.model.data.id, this.model.data.applicationId || this.applicationId, this.model.data.actionId);
  }
  submitQns(emitObj) {
    // console.log('PSSL submit', emitObj);
    this.askCAMR = false;
    this.showProgess = true;
    this.modalStepper = false;


    switch (emitObj.formId) {
        case 'SA': {
          this._psslService.post(
            JSON.stringify({
              'applicationId': this.model.data.applicationId || this.applicationId,
              'saId': this.model.data.id || 0,
              'actionId': emitObj.actionId,
              'saType': this.selectedSaType,
              'camrAppName': this.camrAppName,
              'camrListDos': this.camrListDos.filter(item => item !== this.applicationId), // filter out main camr
              'questionsResponseDOs': emitObj.postBody
            })
          ).subscribe(res => {
              this.showProgess = false;
              this.modalStepper = false;
              this.submitSASucess = true;
              this.saIdSubmitted = res.saId;
              this.closeModalEvent.next('success');
          }, err => {
              this.showProgess = false;
              this.modalStepper = false;
              this.errOnSubmit = true;
          });
          break;
        }
        case 'SAS': {
          this._psslService.postSAScoping(
            24, // 12 action on Submit SA as per request from new SA/CSA consolidation
            this.model.data.id || 0,
            JSON.stringify({
              'saId': this.model.data.id || 0,
              'actionId': 24,
              'applicationId': this.model.data.applicationId || this.applicationId,
              'questionsResponseDOs': emitObj.postBody})
          ).subscribe(res => {
            this.showProgess = false;
            this.modalStepper = false;
            this.submitSASucess = true;
            this.closeModalEvent.next('success');
          }, err => {
            this.showProgess = false;
            this.modalStepper = false;
            this.errOnSubmit = true;
          });
          break;
        }
        case 'SAT': {
          this._psslService.postSATriage(
            (emitObj.action === 25) ? 25 : 12, // 12 for submit triage, 24 for need more info
            this.model.data.id || 0,
            JSON.stringify({
              'saId': this.model.data.id || 0,
              'actionId': 12,
              'applicationId': this.model.data.applicationId || this.applicationId,
              'questionsResponseDOs': emitObj.postBody})
          ).subscribe(res => {
              this.showProgess = false;
              this.modalStepper = false;
              this.submitSASucess = true;
              this.closeModalEvent.next('success');
          }, err => {
              this.showProgess = false;
              this.modalStepper = false;
              this.errOnSubmit = true;
          });
          break;
        }

        default: {
            break;
        }
    }


  }

}
