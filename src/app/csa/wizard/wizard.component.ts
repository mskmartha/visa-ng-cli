import {Component, Input, OnInit, Output} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import { CSAService } from '../csa.service';
import { IInjectData } from '../../shared/shared.interface';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
@Component({
  selector : 'app-csa-wizard',
  templateUrl: 'wizard.component.html',
  providers: [CSAService],
  styleUrls: ['wizard.component.css'],
})
export class CSAWizardComponent implements OnInit {
  qnsMeta;
  isCAMRDisabled = false;
  injectData: IInjectData;

  @Input() model: any;
  @Output() closeModalEvent = new BehaviorSubject('cancel');

  // camr
  askCAMR = true;
  public camrForm: FormGroup;
  public events: any[] = [];
  //
  public postQsMap: any = {};
  submitSASucess = false;
  modalStepper = false;
  showProgess = false;
  errOnSubmit = false;
  public editCSA;
  csaMain = 'csaMain';
  ///
  applicationId = ['0'];
  filteredCAMRs: any;
  allCAMRs = [
  ];
  constructor(private fb: FormBuilder, private _csaService: CSAService ) {
    // view csa prefill camr
    this.camrForm = this.fb.group({
        application: ''
    });
    this.filteredCAMRs = this.camrForm.controls.application.valueChanges
      .startWith(null)
      .map(name => this.filterCAMRs(name));
  }
  ngOnInit() {
    console.log('this.model', this.model);
    this.injectData = {
      isViewDisabled: this.model.data.isViewDisabled,
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
    // view mode
    this.isCAMRDisabled = this.model.data.isViewDisabled;
    // view csa
    if (this.model.data.actionId === 1 ) {
      this.askCAMR = false;
      this.modalStepper = true;
      this.viewQuestions(this.model.data.id, this.model.data.camr);
    }
    if (this.model.data.actionId === 3 ) {
      this.askCAMR = false;
      this.modalStepper = true;
      this.viewQuestions(this.model.data.id, this.model.data.camr);
    }

    // get camrs
    this._csaService.camrs().subscribe((camrDOs) => {
      if (Array.isArray(camrDOs) || camrDOs.length ) {
        // console.log("data>>>", data);
        camrDOs.forEach(q => {
          this.allCAMRs.push('' + q.applicationId + ' - ' + q.applicationName + ' (' + q.appShortName + ')');
        });
      } else {
        this.errOnSubmit = true;
      }
    }, err => {
        this.errOnSubmit = true;
    });

  }

  camrSelected(camrConcat: string) {
    this.applicationId = camrConcat.split(' ', 1);
  }
  filterCAMRs(val: string) {
    // console.log(val)
    return val ? this.allCAMRs.filter(s => new RegExp(`${val}`, 'gi').test(s))
               : this.allCAMRs;
  }

  saveCAMR(model?: SampleForm, isValid?: boolean) {
      // console.log(model, isValid);
      this.getQuestions(this.model.data.id || 0, this.applicationId[0]);
  }
  getQuestions(id: number, camr: string) {
    this.askCAMR = false;
    this.showProgess = true;
    this.modalStepper = false;
    this._csaService.questionnaire(id, camr).subscribe(res => {
        this.qnsMeta = res;
        this.showProgess = false;
        this.modalStepper = true;
    }, err => {
        this.showProgess = false;
        this.modalStepper = false;
        this.errOnSubmit = true;
    });
  }
  viewQuestions(id: number, camr: string) {
    this.askCAMR = false;
    this.showProgess = true;
    this.modalStepper = false;
    this._csaService.viewCSA(id, camr).subscribe(res => {
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
    this.getQuestions(this.model.data.id, this.model.data.camr);
  }
  submitQns(emitObj) {
    // console.log('CSA submit', emitObj);
    this.askCAMR = false;
    this.showProgess = true;
    this.modalStepper = false;
    if (this.model.data.id) {
      this._csaService.patch(
        this.model.data.id,
        emitObj.action, // action on button clicked
        this.camrForm.value.camr,
        JSON.stringify({
          'id': this.model.data.id,
          'saId': this.model.data.saId,
          'applicationId': this.applicationId[0],
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
    }else {
      this._csaService.post(
        emitObj.action, // action on button clicked
        this.camrForm.value.camr,
        JSON.stringify({
          'applicationId': this.applicationId[0],
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
    }
  }

}

export interface SampleForm {
  name: string;
  address?: {
    street?: string;
    postcode?: string;
  };
}
