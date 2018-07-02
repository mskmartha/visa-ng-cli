//our root app component
import {Component, Input, OnInit, Output} from '@angular/core';
import { SAARService } from '../../pssl-saar.service';
import { IInjectData } from '../../../shared/shared.interface';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
@Component({
  selector : 'c-wizard',
  templateUrl: 'saarScoping-wizard.component.html',
  // styleUrls: ['../pssl-saar.component.css'],
  providers: [SAARService]
})
export class SaarScopingWizardComponent implements OnInit {
  @Input() model: any;
  @Output() closeModalEvent = new BehaviorSubject('cancel');
  qnsMeta;
  injectData: IInjectData;
  subscription: any;
  psslData: any;
  public parsedValues: any;
  submitSASucess = false;
  modalStepper = true;
  showProgess = false;
  errOnSubmit = false;
  requestData: any;
  temp = [];
  constructor(private _saarService: SAARService ) {
  }
  ngOnInit() {
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
      customBttns: []
    };

    this.getQuestions();
  }
  getQuestions() {
    this.showProgess = true;
    this.modalStepper = false;
    this._saarService.saarquestionnaire(this.model.data).subscribe(res => {
      this.qnsMeta = res;
      this.showProgess = false;
      this.modalStepper = true;
    }, err => {
      this.showProgess = false;
      this.errOnSubmit = true;
    });
  }
  submitQns(emitObj) {
    this.requestData = {
      'applicationId': this.model.data.applicationId,
      'id': 0,
      'saId': this.model.data.id,
      'actionId': 0,
      'questionsResponseDOs': emitObj.postBody
    };

    this.showProgess = true;
    this.modalStepper = false;

    this._saarService.post(JSON.stringify(this.requestData), this.model.data).subscribe(res => {
      this.modalStepper = false;
      this.showProgess = false;
      this.submitSASucess = true;
      this.closeModalEvent.next('success');
    }, err => {
        this.showProgess = false;
        this.modalStepper = false;
        this.submitSASucess = false;
        this.errOnSubmit = true;
    });
  }
}
