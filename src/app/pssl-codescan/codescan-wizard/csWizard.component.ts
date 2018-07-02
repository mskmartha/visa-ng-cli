import { Component, NgModule, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { PSSLCodeScanService } from '../pssl-codescan.service';
import {PSSLSummaryService} from '../../pssl-summary/pssl-summary.service';
import {NgForm, FormsModule, ReactiveFormsModule, FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import {Observable} from 'rxjs/Observable';

@Component({
  selector : 'app-cs-wizard',
  templateUrl : './csWizard.component.html',
  styles: [`:host ::ng-deep .mat-form-field-infix {
    min-width: 450px;
  }`],
  providers: [PSSLCodeScanService, PSSLSummaryService]
})
export class PSSLCsWizardComponent implements OnInit {
    saId: number;
    public codeScans: Array<any> = [];
    public codeScanDetails: Array<any> = [];
    public edited = false;
    public records = false;
    Id: any = '';
    public showProgess = false;
    public fullLengthMsg = false;
    public parsedData = [];
    public IsPresentVal= false;
    public isScanValid= false;
    public submitScanSucess = false;
    public errOnSubmit = false;
    public submitSuccess = false;
    public SADetails;
    public addProjForm: FormGroup;
    projectName: string;
    filteredOptions: any;
    filteredproject = [
    ];
    projectValid;
    constructor(@Inject(MAT_DIALOG_DATA) SADetails, private _psslSummaryService: PSSLSummaryService,
      private _dialog: MatDialog, private _psslCodeScanService: PSSLCodeScanService, private _fb: FormBuilder) {
      this.SADetails = SADetails;
      this.addProjForm = this._fb.group({
          project: [
              {
                value: '',
                disabled: false
              },
              Validators.required
            ]
      });
      this.filteredOptions = this.addProjForm.controls.project.valueChanges
        .startWith(null)
        .map(val => val ? this.filterProjects(val) : this.filteredproject);
    }

    ngOnInit() {
      this.edited = true;
      this.records = false;
      this.showProgess = false;
      this.isScanValid = false;
      this.submitScanSucess = false;
      this._psslCodeScanService.getCodeScanProjects().subscribe(projects => {
        if (Array.isArray(projects) || projects.length ) {
          // console.log("data>>>", data);
          projects.forEach(q => {
            this.filteredproject.push(q);
          });
        } else {
          this.errOnSubmit = true;
        }
      });
  }
  filterProjects(val: string): string[] {
    return this.filteredproject.filter(s => new RegExp(`${val}`, 'gi').test(s));
  }

  callCodeScan() {
    this.showProgess = true;
    this.isScanValid = false;
    this.edited = false;
    this.submitScanSucess = false;
    this.projectName = this.addProjForm.value.project;
    this._psslCodeScanService.getProjectName(this.addProjForm.value.project).subscribe((codeScanData) => {
      this.showProgess = false;
      this.isScanValid = false;
      this.submitScanSucess = false;
      this.records = true;
      this.codeScans = codeScanData;
      this.codeScanDetails = codeScanData;
      // if (this.codeScanDetails.length > 0) {
      // console.log('this.codeScanDetails.length>>', this.codeScanDetails.length);
      if (this.codeScanDetails) {
        for (const item of codeScanData) {
          if (item.IsPresent === 'true') {
            this.IsPresentVal = true;
          } else {
            this.IsPresentVal = false;
          }
        }
      }
    }, err => {
        this.showProgess = false;
        this.errOnSubmit = true;
    });
  }
  generateArray(obj) {
    return Object.keys(obj).map((key) => {
      return obj[key];
    });
  }
  saveScan() {
    this.records = false;
    this.showProgess = true;
    this.fullLengthMsg = true;
    this.isScanValid = false;
    this.IsPresentVal = false;
    this.submitScanSucess = false;
    this._psslCodeScanService.saveScanDetail(this.SADetails.id, this.addProjForm.value.project,
      this.Id).subscribe((scanSubmit) => {
      this.showProgess = false;
      this.fullLengthMsg = false;
      this.isScanValid = false;
      this.submitScanSucess = true;
      this.submitSuccess = true;
      this.IsPresentVal = false;
      this.codeScanDetails = scanSubmit;
    }, err => {
        if (err.status === 417) {
          this.showProgess = false;
          this.fullLengthMsg = false;
          this.isScanValid = true;
          this.IsPresentVal = true;
          this.submitScanSucess = false;
          this.errOnSubmit = true;
        } else {
          this.showProgess = false;
          this.fullLengthMsg = false
          this.edited = false;
          this.records = false;
          this.errOnSubmit = true;
        }
    });
  }
  goToPrevious() {
    this.edited = true;
    this.records = false;
  }
  tryAgain() {
    this.projectName = '';
      this.Id = ''; // to reset any previously selected Id's
      this.errOnSubmit = false;
      this.showProgess = false;
      this.edited = true;
      this.records = false;
      this.isScanValid = false;
      this.submitScanSucess = false;
      this.addProjForm.patchValue({
          'project' : '',
        });
  }
  validateProject() {
    return (this.filteredproject.indexOf(this.addProjForm.value.project) >= 0);
  }
}
