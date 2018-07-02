import {Component, NgModule, Inject, ViewChild, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgForm, FormsModule, ReactiveFormsModule, FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { KCCService } from '../kcc.service';
import { DclWrapperComponent, StepWizComponent } from '../../shared/multistep-wizard/multistep-wrapper.component';
import { IInjectData } from '../../shared/shared.interface';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
@Component({
  selector : 'app-kcc-wizard',
  templateUrl: 'wizard.component.html',
  providers: [KCCService],
  styleUrls: ['wizard.component.css'],
})
export class KCCWizardComponent implements OnInit {
  qnsMeta;
  isPMMDisabled = false;
  injectData: IInjectData;

  @Input() model: any;
  @Output() closeModalEvent = new BehaviorSubject('cancel');
  // pmm
  askPMM = true;
  public pmmForm: FormGroup;
  public submitted: boolean;
  public events: any[] = [];
  //
  public postQsMap: any = {};
  submitSASucess = false;
  modalStepper = false;
  showProgess = false;
  errOnSubmit = false;
  public editKCC;
  kccMain = 'kccMain';
  constructor(private fb: FormBuilder, private _kccService: KCCService ) {
  }
  ngOnInit() {
    console.log('this.model', this.model);
    this.injectData = {
      isViewDisabled: this.model.data.isViewDisabled,
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
          buttonTxt: 'Save for Later',
          action: 10,
          class: 'cta-1',
          canShow: (this.model.data.actionId === 6) ? false : true,
          enableOnFormDirty: true
        },
        {
          buttonId: 2,
          buttonTxt: 'Re-Submit For Review',
          action: 12,
          class: 'cta-1',
          canShow: (this.model.data.currentStatus === 9) ? true : false, // show this button only when kcc status is "need more info"
          enableOnFormDirty: false
        }
      ]
    };
    // view mode
    this.isPMMDisabled = this.model.data.isViewDisabled;
    // edit kcc
    if (this.model.data.action === 9 ) {
      this.askPMM = false;
      this.modalStepper = true;
      this.getQuestions(this.model.data.id, this.model.data.pmm);
    }
    let isPmm = '';
    if (this.model.data.pmm !== undefined) {
      isPmm = (this.model.data.pmm).toString();
    }
    // view kcc prefill pmm
    this.pmmForm = this.fb.group({
        pmm: [
            {
              value: (isPmm),
              disabled: this.model.data.isViewDisabled
            },
            Validators.required
          ]
    });
  }

  savePmm() {
      this.submitted = true;
      // console.log(model, isValid);
      this.getQuestions(this.model.data.id || 0, this.pmmForm.value.pmm);
  }
  getQuestions(id: number, pmm: boolean) {
    this.askPMM = false;
    this.showProgess = true;
    this.modalStepper = false;
    this._kccService.questionnaire(id, pmm).subscribe(res => {
        this.qnsMeta = res;
        this.showProgess = false;
        this.modalStepper = true;
    }, err => {
        this.showProgess = false;
        this.modalStepper = false;
        this.errOnSubmit = true;
    });
  }
  tryAgain() {
    this.getQuestions(this.model.data.id, this.model.data.pmm);
  }
  submitQns(emitObj) {
    console.log('KCC submit', emitObj);
    this.askPMM = false;
    this.showProgess = true;
    this.modalStepper = false;

    this._kccService.post(
      emitObj.action, // action on button clicked
      this.pmmForm.value.pmm,
      JSON.stringify({'id': this.model.data.id || 0, 'questionsResponseDOs': emitObj.postBody})
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
  }

}

