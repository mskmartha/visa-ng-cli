import { Injectable } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

import { QuestionBase } from './question-base';
import { CustomValidators } from './custom.validators';
@Injectable()
export class TableValidatorService {
  isDisabled = false;
  constructor(private fb?: FormBuilder) { }

  toFormGroup(tableConfig, isDisabled?: boolean ) {
    this.isDisabled = isDisabled;
    const group: any = {};

    tableConfig.forEach(question => {

      const validators = [];
      if (question.validation.required) {
        validators.push(Validators.required);
      }
      if(question.formControl) {
          group[question.columnDef] = new FormControl(
            {value: (question.columnDef === 'id') ? 0 : '', disabled: false}, validators
          );
      }

    });
    return new FormGroup(group);
  }
}
