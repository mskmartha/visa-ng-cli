import {Component, Input, forwardRef, ElementRef, EventEmitter, Output, OnInit, ViewChild} from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR, FormGroup, Validators, FormControl} from '@angular/forms';
import { HttpClient } from '../http.client';
import { Response } from '@angular/http';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material';
import {Observable} from 'rxjs/Observable';
@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete-multi-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleMultiSelComponent),
      multi: true
    }
  ],
  styles: [`
    .multiAuto{
      float:left;
      margin:2px;
      padding:2px 15px;
    }
    mat-form-field {
      padding: 0;
    }
    .multiAuto a{
      cursor:pointer;
      font-weight:bold;
      font-size:20px;
      color: red;
    }

  `]
})
export class AutocompleMultiSelComponent implements ControlValueAccessor, OnInit {

  @Input() placeholder: string;
  index = 0;
  canLoadMore = true;
  @Input() autocomplete: any;
  @ViewChild(MatAutocomplete) autocompleteRef: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @Input() parentForm: any;

  @Input() isViewDisabled: boolean;
  @Output() eventEmit = new EventEmitter();
  public elementRef;
  public newGroup: FormGroup = new FormGroup({}, Validators.required);
  public autocompForm: FormGroup;
  public selected = [];
  public query = '';

  autoCompOptns = [];

  autoCompDataMap = new Map<String, String>();
  constructor(
      private http: HttpClient,
      private fb: FormBuilder,
      myElement: ElementRef
  ) {
    this.elementRef = myElement;
  if(this.parentForm) {
    this.autocompForm = this.fb.group({
      auto:  [''], // set '' instead of null as it will pass null as search param
      primary: [{value: null, required: this.parentForm.required}],
      multiAuto:  [{value: null, required: this.parentForm.required}]
    });
  } else {
    this.autocompForm = this.fb.group({
      auto:  [''], // set '' instead of null as it will pass null as search param
      primary: [null, Validators.required],
      multiAuto:  [null, Validators.required]
    });
  }
  }
  ngOnInit() {
    if (this.parentForm) {
      this.parentForm.answers.forEach(val => {
        this.newGroup.addControl(val, new FormControl(
          {value: false, disabled: false}, []
        ));
        if (Number(val)) { // after autocomplete implementation
          // backfill if any
          // if cached: true look in session storage with id
          // else get from api
          this.http.get(this.autocomplete.backfillUrl + '/' + val)
            .subscribe((autocompRes: Response) => {
              const res = <AutocompRes>autocompRes.json();

              // some api may not not have 'id' field in the response
              if (!res['id']) {
                res['id'] = val;
              }

              // push only the first match
              if (this.autocomplete.multi) {
                this.autoCompDataMap.set(res.id, res.cn);
                // preselect primary
                if (this.autocomplete.multi.primaryValue === res.id) {
                  this.autocompForm.controls['primary'].setValue(res.id);
                  this.autocompForm.controls['multiAuto'].setValue(this.getAutoCompArr());
                }
              } else {
                this.autocompForm.controls['auto'].setValue(res.cn);
                this.autocompForm.controls['multiAuto'].setValue(res.cn);
              }
            })
        } else { // fallback for backfill for all the SA's before we had autocomplete, when it was text filed with single value, when name was used instead if id
          this.autocompForm.controls['auto'].setValue(val);
          this.autocompForm.controls['multiAuto'].setValue(val);
        }
      });

    }
    this.autocompForm.get('primary').valueChanges.subscribe(id => {
      if (id) {
        this.autoCompPromise(id).then((arr) => {
          this.emitFinalArr(arr);
        });
      }
    });
    this.autocompForm.get('auto').valueChanges
      .debounceTime(300)
      .do(val => {
        // clear value on key keyup, set it only after selection from drop down
        Object.keys(this.newGroup.controls).forEach(cntrl => {
          this.newGroup.controls[cntrl].disable();
        });
        this.autoCompOptns =[];
        this.autoCompData();
      })
      .subscribe();

  }
  emitFinalArr(arr) {
    this.eventEmit.next({
      parentForm: this.parentForm,
      autocomplete: arr
      // autocomplete: (this.getAutoCompArr().length > 0) ? arr : null
    });
  }
  autoCompPromise(id?) {
    return new Promise((resolve) => {

      const arr = this.getAutoCompArr().filter(val => val !== id);
      arr.unshift(id);
      this.autocompForm.controls['multiAuto'].setValue(arr);
      resolve(arr);
      });
  }
  autoCompPromiseRm(id?) {
    return new Promise((resolve) => {
      const arr = this.getAutoCompArr().filter(val => val !== id);
      this.autocompForm.controls['multiAuto'].setValue(arr);
      resolve(arr);
    });
  }
  autoCompData() {
    if (this.isViewDisabled) {
      return;
    }
    ///search?tsrGroupId=&keyword=&page=0&size=5&sort=tsrTitle,asc
    this.http.get(this.autocomplete.url + '?keyword=' + this.autocompForm.controls['auto'].value + '&page=' + this.index)
      .toPromise()
      .then(res => {
        if (res.json().content.length > 0) {
          this.canLoadMore = true;
        }else {
          this.canLoadMore = false;
        }
        this.autoCompOptns.push.apply(this.autoCompOptns, res.json().content);
      });
  }
  getAutoCompArr() {
    return Array.from(this.autoCompDataMap.keys());
  }

  selAutoCompOpt(item) {
    Object.keys(this.newGroup.controls).forEach(cntrl => {
      this.newGroup.controls[cntrl].disable();
    });

    this.newGroup.setControl(item.id, new FormControl(
      {value: false, disabled: false}, []
    ));

    // reset value in autocomplete field
    this.autocompForm.controls['auto'].setValue(item.cn);
    this.autocompForm.controls['multiAuto'].setValue(item);

    // reset autocomplete dropdown
    this.autoCompOptns = [];
    this.emitFinalArr((item.id).toString());
  }

  multiSelAutoCompOpt(item) {

    this.newGroup.setControl(item.id, new FormControl(
      {value: false, disabled: false}, []
    ));

    this.autoCompDataMap.set(item.id, item.cn);

    // reset value in autocomplete field
    this.autocompForm.controls['auto'].setValue('');
    // reset autocomplete dropdown
    this.autoCompOptns = [];

    this.autocompForm.controls['multiAuto'].setValue(this.getAutoCompArr());

    // if this is the first item in the array set it as primary by default
    if (this.getAutoCompArr().length === 1) {
      this.autocompForm.controls['primary'].setValue(this.getAutoCompArr()[0]);
    }
    this.emitFinalArr(this.getAutoCompArr());
  }
  removeAutoCompOpt(id) {
    this.autoCompDataMap.delete(id);
    this.newGroup.controls[id].disable();
    if (this.autocomplete.multi.hasPrimary && id === this.autocompForm.controls['primary'].value) {
      // if primary item deleted, then reset
      this.autocompForm.controls['primary'].reset();
      this.autocompForm.controls['multiAuto'].setValue(this.getAutoCompArr());
      this.emitFinalArr(null);
      return;
    }

    this.autoCompPromiseRm(id).then((arr) => {
      this.emitFinalArr(arr);
    });
  }

  writeValue(value: any) {
    if (value !== undefined) {
    }
  }
  propagateChange = (_: any) => { };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  subPanelScroll() {
    this.index = 0;
    setTimeout(() => {
      if (this.autocompleteRef && this.autocompleteTrigger && this.autocompleteRef.panel) {
        console.log(this.autocompleteRef.panel);
        Observable.fromEvent(this.autocompleteRef.panel.nativeElement, 'scroll')
          .map(x => this.autocompleteRef.panel.nativeElement.scrollTop)
          .takeUntil(this.autocompleteTrigger.panelClosingActions)
          .subscribe((x) => {
            if((x >= .60 * this.autocompleteRef.panel.nativeElement.scrollHeight) && this.canLoadMore) {
              this.canLoadMore = false;
              this.index ++;
              this.autoCompData();
            }
          });
      }
    });
  }
  registerOnTouched() { }
}
interface AutocompRes {
  id?: string;
  cn: string;
}
