import {Component, EventEmitter, Output, Input,OnInit} from '@angular/core';
import {DclWrapperComponent } from './multistep-wrapper.component';
import { StepWizComponent } from './multistep-wrapper.component';
import * as moment from 'moment/moment';
@Component({
  selector: 'app-multistep-wiz',
  template: `
    <mat-tab-group *ngIf="steps.length > 1" [(selectedIndex)]="selectedIndex">
        <mat-tab *ngFor="let step of steps; let i = index" 
        label="{{(injectData.customLabels || step.stepName == '') ? 'Step '+(i+1) : step.stepName}}" 
        [disabled]="!canMove(i)">
            <app-dcl-wrapper [step]="step" [injectData]="injectData" (stepEvent)="changeStep($event)"
             (reloadEmit)="reloadQns($event)"></app-dcl-wrapper>
        </mat-tab>
    </mat-tab-group>
    <div *ngIf="steps.length === 1">
        <app-dcl-wrapper [step]="steps[0]" [injectData]="injectData" (stepEvent)="changeStep($event)"
        (reloadEmit)="reloadQns($event)"></app-dcl-wrapper>
    </div>
`,
  providers: [DclWrapperComponent]
})
export class MultiStepWizardComponent implements OnInit {
  @Output() stepEvent = new EventEmitter();
  @Output() reloadEmit = new EventEmitter();
  steps = [];
  requestData = {
    'questionsResponseDOs': []
  };
  postBody: any = {};
  supportForm: any = {};
  @Input() qnsMeta;
  @Input() injectData;
  stepOneComplete = false;
  subscription: any;
  psslData: any;
  public parsedValues: any;
  submitSASucess = false;
  modalStepper = false;
  showProgess = false;
  errOnSubmit = false;
  public _selectedIndex = 0;
  public qnsMap: any = {};
  public ansArr = [];
  constructor() {}
  ngOnInit() {
    this.qnsMeta.steps.forEach((step, index) => {
      // for submit
      step.group.forEach((group) => {
        group.questions.forEach(question => {
          // create a flat questions map object
          this.qnsMap[question.questionId] = new Object({
            questionType: question.questionType,
            options: question.options.map((opt) => opt.optionId),
            optionsObj: question.options,
            jump: true,
            indent: 0,
            manyToOneJump: [],
            description: question.description
          });
          // ansArr for filter to persist values on save and submit
          if (question.answers.length > 0 && question.answers[0] !== '') {
            let n;
            if (question.questionType === 'date' && question.answers[0] !== '') {
              n = moment(question.answers[0], 'x').format();
            } else {
              n = question.answers[0];
            }
            this.ansArr.push({
              'questionType': question.questionType,
              'questionId': question.questionId,
              'value': n,
              'description': '',
              'selectedOptions': question.answers
            });
          }
        });
      });
      this.steps.push({
        isStepDisabled: false, // disabled
        length: this.qnsMeta.steps.length, // steps length
        type: StepWizComponent, // comp
        formIndex: index, // step#
        stepName: step.stepName, // step name
        groupLayout: this.qnsMeta.groupLayout,
        groupedQns: this.qnsMeta.steps[index].group, // questions
        qnsMap: this.qnsMap
      });
      // console.log("steps", this.steps)
    });
  }
  get selectedIndex(): number {
    return this._selectedIndex;
  }

  set selectedIndex(selectedIndex: number) {
    this._selectedIndex = selectedIndex;
  }

  changeStep(obj) {
    const first = Object.keys(obj)[0];
    if (obj[first].formValue) {
      this.postBody[first] = obj[first].formValue;
      this.supportForm[first] = obj[first].supportingForm;
    }
    if (obj[first].goToStep === 1) {
      // TODO: reset when step1 is edited
      this.stepOneComplete = true;
    }
    this.selectedIndex = obj[first].goToStep;
    if (obj[first].submit) { // submit questionnaire
      this.submitQuestions(obj[first].action); // send back the actionId on button
    }
  }
  reloadQns(val) {
    this.reloadEmit.next(val);
  }
  canMove(index: number): boolean {
    switch (index) {
      case 0:
        return true;
      default:
        if (this.stepOneComplete) {
          return true;
        } else {
          return false;
        }
    }
  }
  submitQuestions(action) {
    // when submit send the complete form value
    this.stepEvent.next({action: action, formId: this.injectData.formId, postBody: this.genPostBody(action)});
  }
  genPostBody(action: number) {
    const qnsArr = [];
    Object.keys(this.postBody).forEach(step => {
      Object.keys(this.postBody[step]).forEach(question => {
        qnsArr.push({
          'questionType': this.qnsMap[question].questionType,
          'questionId': question,
          'value': this.filterVal(question, this.postBody[step][question]),
          'description': (this.supportForm[step][question]) ? this.supportForm[step][question] : null,
          'selectedOptions': this.filterOptions(question, this.postBody[step][question])
        });
        // filter answered qns
        this.ansArr = this.ansArr.filter(function( obj ) {
          return obj.questionId !== question;
        });
      });
    });
    // persist old and concat new form field values
    return this.ansArr.concat(qnsArr);
  }
  filterVal(qnId: string, optns: any) {
    if (Array.isArray(optns)) {
      return '';
    } else if (typeof optns === 'object') {
      Object.keys(optns).forEach(opt => {
        optns = opt;
      });
      return optns;
    } else {
      return optns;
    }
  }
  filterOptions(qnId: string, optns: any) {
    const answerArr = [];
    if (Array.isArray(optns)) {
      if (this.qnsMap[qnId].questionType === 'autocomplete' || this.qnsMap[qnId].questionType === 'multiRow' || this.qnsMap[qnId].questionType === 'comment') {
        return optns;
      } else {
        optns.forEach((item, index) => {
          if (item) {
            answerArr.push(this.qnsMap[qnId].options[index]);
          }
        });
        return answerArr;
      }
    } else if (typeof optns === 'object') {
      Object.keys(optns).forEach(opt => {
        answerArr.push(opt);
      });
      return answerArr;
    } else {
      if (this.qnsMap[qnId].questionType === 'radio') {
        answerArr.push(optns);
      } else {
        answerArr.push('');
      }
      return answerArr;
    }
  }
}
