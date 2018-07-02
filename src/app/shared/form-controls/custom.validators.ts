import { FormArray } from '@angular/forms';
import { FormControl } from '@angular/forms';
import * as moment from 'moment/moment';
export class CustomValidators {
  static multipleCheckboxRequireOne(fa: FormArray) {
    let valid = false;
    for (let x = 0; x < fa.length; ++x) {
      if (fa.at(x).value) {
        valid = true;
        break;
      }
    }
    return valid ? null : {
      multipleCheckboxRequireOne: true
    };
  }
  /*
  static emailFormat(control: FormControl) {
    let pattern:RegExp = /\S+@\S+\.\S+/;
    return pattern.test(control.value) ? null : {'emailFormat': true};
  }*/
  static dateRestriction(control: FormControl) {
    const now = moment(new Date()); // todays date
    const myDate = moment(new Date(parseInt(control.value, 0 )));
    const duration = moment.duration(now.diff(myDate));
    const days = duration.asDays();
    console.log(myDate, days)
    let valid;
    // TODO: make no of days dynamic
    if (days < -11) {
      valid = true;
    } else {
      valid = false;
    }
    return valid ? null : {
      dateRestriction: 'Selected Date is less than 11 days from now, please provide a justification below'
    };
  }
}
