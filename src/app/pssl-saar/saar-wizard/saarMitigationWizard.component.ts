import {Component, NgModule,Inject, ViewChild} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
@Component({
    selector : 'saar-mitigation',
    templateUrl : './saarMitigationWizard.component.html',
    styleUrls: ['./saarWizard.component.css'],
  })
  export class SaarMitigationWizardComponent {
      public mitigationLst = [];
      public mitigationLstFinal:any[] = [];
    constructor(@Inject(MAT_DIALOG_DATA) saarMitigation: any, private _dialog: MatDialog, private _fb: FormBuilder) {
        this.mitigationLst = saarMitigation;
        console.log('this.mitigationLst>>>', this.mitigationLst);
    }
    ngOnInit() {
        this.mitigationLstFinal = Object.keys(this.mitigationLst);
        console.log('this.mitigationLstFinal>>>', this.mitigationLstFinal);
    }
    generateArray(obj){
        return Object.keys(obj).map((key)=>{
            return obj[key]
        });
    }
  }