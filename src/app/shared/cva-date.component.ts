import {Component, Input, forwardRef, OnInit} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as _moment from 'moment';
const moment = _moment;


@Component({
  selector: 'app-cva-date',
  template: `
    <mat-form-field>
      <input matInput [min]="minDate" [max]="maxDate" [matDatepicker]="picker" [value]="dateValue" (dateInput)="addEvent('input', $event)" placeholder="{{parentForm.placeHolder}}" readonly>
      <mat-datepicker-toggle matSuffix *ngIf="!isViewDisabled" [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker disabled="false"></mat-datepicker>
    </mat-form-field>
    <mat-datepicker  #picker></mat-datepicker>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CvaDateComponent),
      multi: true
    }
  ]
})
export class CvaDateComponent implements OnInit, ControlValueAccessor {
  @Input()
  _dateValue; // notice the '_'

  @Input() parentForm

  @Input() isViewDisabled: boolean;
  minDate;
  maxDate;
  constructor() {}
  ngOnInit() {
    this.minDate = (this.parentForm.validation.min === 0 ) ? moment() : null;
    this.maxDate = this.parentForm.validation.max ? moment(Date.now() + this.parentForm.validation.max * 24 * 3600 * 1000) : null;
  }

  get dateValue() {
    return moment(this._dateValue, 'x').format();
  }

  set dateValue(val) {
    if (Number(moment(val).unix() * 1000)) {
      val = (moment(val).unix() * 1000).toString();
    } else {
      val = '';
    }
    this._dateValue = val;
    this.propagateChange(this._dateValue);
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log(event.value);
    this.dateValue = moment(event.value, 'x').format();
  }

  writeValue(value: any) {
    if (value !== undefined) {
      this.dateValue = moment(value, 'x').format();
    }
  }
  propagateChange = (_: any) => { };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }
}
