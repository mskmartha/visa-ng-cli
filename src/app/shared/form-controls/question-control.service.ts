import { Injectable } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

import { QuestionBase } from './question-base';
import { CustomValidators } from './custom.validators';
import * as moment from 'moment/moment';
@Injectable()
export class QuestionControlService {
  isDisabled = false;
  constructor(private fb: FormBuilder) { }

  toFormGroup(questions: QuestionBase<any>[], isDisabled?: boolean ) {
    this.isDisabled = isDisabled;
    const group: any = {};

    questions.forEach(question => {
      if (question.questionType === 'checkbox') {
        // group[question.questionId] = question.required ? this.fb.array([]) : this.fb.array([]);
        group[question.questionId] = this.fb.array(
          question.options.map((opt) => this.fb.control({value: opt.selected, disabled: this.isDisabled})),
          (question.validation.required) ? CustomValidators.multipleCheckboxRequireOne : null
        );

      } else if (question.questionType === 'autocomplete') {
        // group[question.questionId] = question.required ? this.fb.array([]) : this.fb.array([]);
        if ( question.autocomplete.multi) {
          group[question.questionId] = new FormControl(
            {value: question.answers, disabled: this.isDisabled}, (question.validation.required) ? Validators.required : null
          );
        } else {
          group[question.questionId] = new FormControl(
            {value: (question.answers[0] || null), disabled: this.isDisabled}, (question.validation.required) ? Validators.required : null
          );
        }
      } else if (question.questionType === 'multiRow') {
        // group[question.questionId] = question.required ? this.fb.array([]) : this.fb.array([]);
        group[question.questionId] = new FormControl(
          {value: (question.answers.length > 0 ? question.answers : null), disabled: this.isDisabled}, Validators.required
        );
      } else if (question.questionType === 'comment') {
        // group[question.questionId] = question.required ? this.fb.array([]) : this.fb.array([]);
        group[question.questionId] = new FormControl(
          {value: (question.answers.length > 0 ? question.answers : null), disabled: this.isDisabled}
        );
      } else if (question.questionType === 'date') {
        // group[question.questionId] = question.required ? this.fb.array([]) : this.fb.array([]);
        const validators = [];
        if (question.validation.regexPattern === 'Check_11_days') {
          validators.push(CustomValidators.dateRestriction);
        }
        if (question.validation.required) {
          validators.push(Validators.required);
        }

        let de = question.answers[0];
        if (de && !Number(de)) {
          de = (moment(de).unix() * 1000).toString();
        }
        group[question.questionId] = new FormControl(
          {value: de || '', disabled: this.isDisabled}, validators
        );

      } else {
        const validators = [];
        if (question.validation.required) {
          validators.push(Validators.required);
        }

        group[question.questionId] = new FormControl(
          {value: (question.answers[0] || ''), disabled: this.isDisabled}, validators
        );
      }
    });
    return new FormGroup(group);
  }
}
