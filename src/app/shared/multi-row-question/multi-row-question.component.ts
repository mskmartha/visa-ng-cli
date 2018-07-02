import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-multi-row-question',
  templateUrl: './multi-row-question.component.html',
  styleUrls: ['./multi-row-question.component.scss']
})
export class MultiRowQuestionComponent implements OnInit {
  @Input() question;
  @Input() parentForm;
  @Input() isViewDisabled = true;
  @Output() urlEmitter = new EventEmitter();
  public multiRowForm: FormGroup;
  constructor( private fb: FormBuilder) {}

  ngOnInit() {
    if(this.parentForm.answers.length > 0) {
      this.parentForm.answers.forEach((obj, i) => {
        // this.multiRowForm
        if(i === 0) {
          this.multiRowForm = this.fb.group({
            URLs: new FormArray([
              this.initURL(obj),
            ], {updateOn: 'blur'})
          });
        } else {
          const control = <FormArray>this.multiRowForm.controls['URLs'];
          control.push(this.initURL(obj));
        }
      });

    } else {
      this.multiRowForm = this.fb.group({
        URLs: new FormArray([
          this.initURL(),
        ], {updateOn: 'blur'})
      });
    }

    // this.multiRowForm = new FormGroup(this.multiRowForm.controls, {updateOn: 'blur'});
    this.multiRowForm.valueChanges.subscribe(()=> {
      if(this.multiRowForm.status === 'VALID') {
        let arr = [];
        this.multiRowForm.value.URLs.forEach((obj) => {
          arr.push(obj.URL);
        });
        this.urlEmitter.emit({autocomplete: arr, parentForm: this.parentForm});
      } else {
        this.urlEmitter.emit({autocomplete: '', parentForm: this.parentForm});
      }
    });
  }
  initURL(val?) {
    let fb = this.fb.group({
      URL: [{value: val || '', disabled: this.isViewDisabled}, Validators.required]
    });
    return fb;
  }

  addURL() {
    const control = <FormArray>this.multiRowForm.controls['URLs'];
    control.push(this.initURL());
  }
  removeURL(i: number) {
    const control = <FormArray>this.multiRowForm.controls['URLs'];
    control.removeAt(i);
  }
}
