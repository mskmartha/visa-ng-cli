import { Component, Input, OnInit, EventEmitter, Output, ElementRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import { QuestionBase } from '../form-controls/question-base';
import { QuestionControlService } from '../form-controls/question-control.service';
import {DialogsService} from '../modal/dialogs.service';
import {Observable} from 'rxjs/Observable';
import { IInjectData } from '../../shared/shared.interface';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import {SnackBarErrorComponent} from '../html-templates/snack-bar.component';
import {MatSnackBar} from '@angular/material';
@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [ QuestionControlService, DialogsService ],
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  @Output() stepEvent = new EventEmitter();
  @Output() reloadEmit = new EventEmitter();
  @Input() step;
  @Input() injectData: IInjectData;
  invalidSubmit = false;
  questions: QuestionBase<any>[] = [];
  formIndex;
  stepsLength;
  private touchedForm = {};
  private supportingForm = {};
  form: FormGroup;
  stepNumber: number;
  public submitted: boolean;
  // desc textarea support form
  descField = this.fb.group({
  });

  public elementRef;
  constructor(private qcs: QuestionControlService, private dialogsService: DialogsService,
              private fb: FormBuilder,
              myElement: ElementRef,
              public snackBar: MatSnackBar
  ) {
    this.elementRef = myElement;
  }
  get grp_qns() {
      return Observable.of(this.step.groupedQns);
  }

  ngOnInit() {
    // console.log("this.step", this.step)
    this.stepNumber = 0;
    this.formIndex = this.step.formIndex;
    this.stepsLength = this.step.length;
    const jobGroup: FormGroup = new FormGroup({});
    // console.log("this.step.qnsMap",this.step.qnsMap)
    for (const key in this.step.groupedQns) {
      if (this.step.groupedQns.hasOwnProperty(key)) {
        const control: FormArray = new FormArray([
          this.qcs.toFormGroup(this.step.groupedQns[key].questions, this.injectData.isViewDisabled)
        ]);
        this.step.groupedQns[key].questions.forEach(element => {
          // console.log("element", element)
          // iterate options array and reset jump logic
          element.options.forEach(opt => {
            if (opt.qrule) {
                // when backfilling check option is selected
                switch (element.questionType) {
                  case 'checkbox': {
                      opt.qrule.forEach(qn => {
                        if (opt.selected) {
                          this.mapManyToOneJump(qn, element.questionId, opt.optionId);
                        } else {
                          if (this.step.qnsMap[qn].manyToOneJump.length === 0) {
                            this.step.qnsMap[qn].jump = false;
                            // disable control
                            (<FormGroup> control.at(0).get(qn)).disable();
                          }

                        }
                      });
                      break;
                  }
                  default: {
                      opt.qrule.forEach(qn => {
                        if (opt.selected) {
                          this.mapManyToOneJump(qn, element.questionId, opt.optionId);
                        } else {
                          this.step.qnsMap[qn].jump = false;
                          // disable and clear validators on the control
                          (<FormGroup> control.at(0).get(qn)).disable();
                          (<FormGroup> control.at(0).get(qn)).clearValidators();
                        }
                      });
                      break;
                  }
                }
            }
          });

          // if there is desc filed, add supporting form controls
          // set the desc field validator
          if (element.description) {
            this.descField.addControl(element.questionId, new FormControl({value: element.description, disabled: this.injectData.isViewDisabled}, []));
            this.descField.get(element.questionId).valueChanges.subscribe(desc => {
              this.supportingForm[element.questionId] = desc;
            });
          }

          // for all formfields
          control.at(0).get(element.questionId).valueChanges.subscribe(value => {
            if (element.questionType === 'date') {
              if (control.at(0).get(element.questionId).getError('dateRestriction')) {
                // set the desc field validator
                this.descField.addControl(element.questionId, new FormControl({value: null, disabled: false}, []));

                this.descField.get(element.questionId).valueChanges.subscribe(desc => {
                  this.supportingForm[element.questionId] = desc;
                });
              }
            }
            if (this.step.qnsMap[element.questionId].jump) {
              this.touchedForm[element.questionId] = value;
            }
            // console.log('this.touchedForm', this.touchedForm);
            // update postBody on each form field value changed
            const obj: LooseObject = {};
            obj[this.formIndex] = {
              submit: false, // true for final step
              goToStep: this.step.formIndex, // chnage to step
              formValue: this.touchedForm, // post body of the current form
              supportingForm: this.supportingForm,
              action: ''
            };
            // emit to parent comp
            this.stepEvent.next(obj);
          });

          // set indentlevel for nested child questions
          this.setIndentation(element.questionId,
            this.step.qnsMap[element.questionId].optionsObj,
            this.step.qnsMap[element.questionId].indent
          );
        });
        jobGroup.addControl(this.step.groupedQns[key].groupId, control);
      }
    }
    this.form = jobGroup;
  }
  forceClick(event, domElm) {
    if (!Element.prototype.matches) {
      Element.prototype.matches = Element.prototype.msMatchesSelector;
    }
    if (!Element.prototype.closest) {
      Element.prototype.closest = function (selector) {
        let el = this;
        while (el) {
          if (el.matches(selector)) {
            return el;
          }
          el = el.parentElement;
        }
      };
    }
    if (event.target.closest('.cdk-overlay-pane')) {
      return;
    }
    event.target.closest(domElm).getElementsByTagName('input')[0].click();
  }
  commentEvent(val) {
    if(val.comments) {
      (<FormControl>( <FormArray> this.form.controls[val.parentForm.groupId] ).at(0).get(val.parentForm.questionId))
        .reset({value: val.comments, disabled: false });
    }
  }
  multiUrlEvent(val) {
    if (!val.autocomplete) {
      (<FormControl>( <FormArray> this.form.controls[val.parentForm.groupId] ).at(0).get(val.parentForm.questionId)).reset();
    } else {
      (<FormControl>( <FormArray> this.form.controls[val.parentForm.groupId] ).at(0).get(val.parentForm.questionId))
        .setValidators(Validators.required);
      (<FormControl>( <FormArray> this.form.controls[val.parentForm.groupId] ).at(0).get(val.parentForm.questionId))
        .reset({value: val.autocomplete, disabled: false });
    }
  }
  autocompleteEvent(val) {
    if (!val.autocomplete || val.autocomplete.length === 0) {
      if (!val.parentForm.required) {
        (<FormControl>( <FormArray> this.form.controls[val.parentForm.groupId] ).at(0).get(val.parentForm.questionId))
          .setValidators(null);
      }
            (<FormControl>( <FormArray> this.form.controls[val.parentForm.groupId] ).at(0).get(val.parentForm.questionId)).reset();

    } else {
      (<FormControl>( <FormArray> this.form.controls[val.parentForm.groupId] ).at(0).get(val.parentForm.questionId))
        .setValidators(Validators.required);
      (<FormControl>( <FormArray> this.form.controls[val.parentForm.groupId] ).at(0).get(val.parentForm.questionId))
        .reset({value: val.autocomplete, disabled: false });
    }
  }
  mapManyToOneJump(qn, parentQn, parentQnOptId) {
    this.step.qnsMap[qn].manyToOneJump.push(parentQn + '-' + parentQnOptId);
    this.step.qnsMap[qn].jump = true;
  }
  setDateJustification(groupId, questionId) {
    (<FormControl>( <FormArray> this.form.controls[groupId] ).at(0).get(questionId)).setErrors(null);
  }
  jumpLogic(groupId: string, questionId: string, questionType: string, optionId, qrule?: Array<any>) {
    // do nothing when form is disabled
    if (this.injectData.isViewDisabled) {
      return;
    }
    // this is called on radio checkbox and dropdown questions which are the ones with options arr
    switch (questionType) {
      case 'checkbox': { // child question is checkbox
        // show the questions from qrule
        /*qrule.forEach(childQn => {
          this.step.qnsMap[childQn].jump = !this.step.qnsMap[childQn].jump;
          this.resetUpdateFrmCntrl(groupId, questionId, questionType, optionId, childQn);
        });*/
        qrule.forEach(childQn => {
          const val = questionId + '-' + optionId;
          if (this.step.qnsMap[childQn].manyToOneJump.includes(val)) {
            this.step.qnsMap[childQn].manyToOneJump = this.step.qnsMap[childQn].manyToOneJump.filter(function( obj ) {
              return obj !== val;
            });
          } else {
            this.step.qnsMap[childQn].manyToOneJump.push(val);
          }
          if (this.step.qnsMap[childQn].manyToOneJump.length === 0) {
            this.step.qnsMap[childQn].jump = false;
          } else {
            this.step.qnsMap[childQn].jump = true;
          }
          this.resetUpdateFrmCntrl(groupId, questionId, questionType, optionId, childQn);
        });
        break;
      }
      default: { // child question is radio or dropdown
        this.step.qnsMap[questionId].optionsObj.forEach(opt => {
          if (opt.optionId === optionId) {
            if (qrule) {
              qrule.forEach(childQn => {
                this.step.qnsMap[childQn].jump = true;
                this.resetUpdateFrmCntrl(groupId, questionId, questionType, optionId, childQn);
              });
            }
          } else {
            // reset if radio changed
            if (opt.qrule) {
              opt.qrule.forEach(childQn => {
                this.step.qnsMap[childQn].jump = false;
                this.resetUpdateFrmCntrl(groupId, questionId, questionType, optionId, childQn);
              });
            }
          }
        });
        break;
      }
    }
  }
  resetUpdateFrmCntrl(groupId: string, questionId: string, questionType: string, optionId, childQn: string) {
    // console.log("jump", this.step.qnsMap)
    if (childQn) {
      // check parent questionType
      switch (questionType) {
          case 'checkbox': { // parent question is checkbox
              // console.log("qrule type", childQn, this.step.qnsMap[childQn].questionType,this.step.qnsMap[childQn].jump)
              if (!this.step.qnsMap[childQn].jump) {
                switch (this.step.qnsMap[childQn].questionType) {
                    case 'checkbox': {
                      (<FormArray> (<FormGroup> (<FormArray>this.form.controls[groupId]).controls[0]).get(childQn)).disable();
                      break;
                    }
                    default: {
                        (<FormControl>( <FormArray> this.form.controls[groupId] ).at(0).get(childQn)).reset({value: '', disabled: true });
                        (<FormControl>( <FormArray> this.form.controls[groupId] ).at(0).get(childQn)).clearValidators();
                        break;
                    }
                }
              }
              if (this.step.qnsMap[childQn].jump) {
                switch (this.step.qnsMap[childQn].questionType) {
                    case 'checkbox': {
                        (<FormArray> (<FormGroup> (<FormArray>this.form.controls[groupId]).controls[0]).get(childQn)).enable();
                        (<FormControl>( <FormArray> this.form.controls[groupId] ).at(0).get(childQn)).reset({value: [], disabled: false });
                        break;
                    }
                    default: {
                        (<FormControl>( <FormArray> this.form.controls[groupId] ).at(0).get(childQn)).setValidators(Validators.required);
                        (<FormControl>( <FormArray> this.form.controls[groupId] ).at(0).get(childQn)).reset({value: '', disabled: false });
                        break;
                    }
                }
              }
              break;
          }
          default: { // parent question
              // console.log('qrule type', childQn, this.step.qnsMap[childQn].questionType, this.step.qnsMap[childQn].jump);
              if (!this.step.qnsMap[childQn].jump) {
                switch (this.step.qnsMap[childQn].questionType) {
                    case 'checkbox': {
                      (<FormArray> (<FormGroup> (<FormArray>this.form.controls[groupId]).controls[0]).get(childQn)).disable();
                      break;
                    }
                    default: {
                        (<FormControl>( <FormArray> this.form.controls[groupId] ).at(0).get(childQn)).reset({value: '', disabled: true });
                        (<FormControl>( <FormArray> this.form.controls[groupId] ).at(0).get(childQn)).clearValidators();
                        break;
                    }
                }
              }
              if (this.step.qnsMap[childQn].jump) {
                switch (this.step.qnsMap[childQn].questionType) {
                    case 'checkbox': {
                        (<FormArray> (<FormGroup> (<FormArray>this.form.controls[groupId]).controls[0]).get(childQn)).enable();
                        (<FormControl>( <FormArray> this.form.controls[groupId] ).at(0).get(childQn)).reset({value: [], disabled: false });
                        break;
                    }
                    default: {
                        (<FormControl>( <FormArray> this.form.controls[groupId] ).at(0).get(childQn)).setValidators(Validators.required);
                        (<FormControl>( <FormArray> this.form.controls[groupId] ).at(0).get(childQn)).reset({value: '', disabled: false });
                        break;
                    }
                }
              }
              break;
          }
      }

      this.step.qnsMap[childQn].optionsObj.forEach(opt => {
          if (opt.qrule) {
            opt.qrule.forEach( childQnId => {
              this.step.qnsMap[childQnId].jump = false;
              this.resetUpdateFrmCntrl(groupId, questionId, questionType, optionId, childQnId);
            });
          }
      });
    }
  }
  setIndentation(qn, childQnsArr, level) {
    this.step.qnsMap[qn].indent = level;
    // recursively indent nested child questions
    for (const i in childQnsArr) {
      if (childQnsArr[i].qrule) {
        childQnsArr[i].qrule.forEach( childQn => {
            const setChildIndent = level + 1;
            this.step.qnsMap[childQn].indent = setChildIndent;
        });
      }
    }
  }
  public openCommentsDialog(comments: any, dataInj?: any, group?: string) {
    const modalConfig: any = {
      disableClose: false,
      width: '30%',
      height: '',
      data: {
        message: 'test message',
        showCancelBttn: true,
        showTitle: true,
        dynComps: [ // required
            {
                data: {
                  id: this.injectData.id,
                  groupId: group ,
                  type: dataInj.type || this.injectData.formId,
                  teamId: (dataInj.teamId) ? dataInj.teamId : null,
                  comments: comments
                },
                compName: 'chat'
            }
        ]
      }
    };
    this.dialogsService
      .openDialog('Comments', 'message to modal', modalConfig)
      .subscribe(res => {
        const resultFromModal: any = res;
        if (resultFromModal !== 'cancel') {
          this.reloadQns();
        }
      });
  }
  reloadQns() {
    this.reloadEmit.next(true);
  }
  customBttnEvent(action) {
      switch (action) {
      case 10:
          this.onSubmit(this.stepsLength, action);
          break;
      case 12:
          this.onSubmit(this.stepsLength, action);
          break;
      case 25: // SA Triage need more info
        this.onSubmit(this.stepsLength, action);
        break;
      default:
          break;
      }
  }
  onSubmit(goToStep, action?: number) {
    this.stepNumber = 0;
    const obj: LooseObject = {};
    obj[this.formIndex] = {
      submit: (goToStep === this.stepsLength) ? true : false, // true for final step
      goToStep: goToStep, // chnage to step
      formValue: Object.keys(this.touchedForm).length ? this.touchedForm : [], // post body of the current form
      supportingForm: Object.keys(this.supportingForm).length ? this.supportingForm : [], // post body of the current supporting form
      action: action
    };
    // emit to parent comp
    this.stepEvent.next(obj);
  }

  setStep(index: number) {
    this.stepNumber = index;
  }

  nextStep() {
    this.stepNumber++;
  }

  prevStep() {
    this.stepNumber--;
  }

  invalidSubmitError() {
    this.invalidSubmit = true;
    this.snackBar.openFromComponent(SnackBarErrorComponent, {
      duration: 2000,
      data: 'Please fill in all the required fields'
    });
  }
}

interface LooseObject {
    [key: string]: any;
}
