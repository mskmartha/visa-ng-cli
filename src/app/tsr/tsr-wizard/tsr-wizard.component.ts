import {Component, NgModule, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { NgForm } from '@angular/forms';
@Component({
    selector : 'app-tsr-wizard',
    templateUrl : './tsr-wizard.component.html',
    styles: [`
        mat-form-field{
            width:95%;
        }
        .example-form {
            min-width: 150px;
            width: 100%;
        }

        .example-full-width {
            width: 100%;
        }
        table, th, td{
            border: unset !important;
        }
    `],
    providers: []
})
export class TSRWizardComponent {
    public tsr;
    public modalStepper = true;
    public showProgess = false;
    public errOnSubmit = false;
    constructor(@Inject(MAT_DIALOG_DATA) tsr: any) {
        this.tsr = tsr;
    }
}
