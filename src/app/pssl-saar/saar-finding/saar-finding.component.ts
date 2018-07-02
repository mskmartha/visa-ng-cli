import {MatCard} from '@angular/material';
import {Component, AfterViewInit, Input, Inject, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {NgForm, FormsModule, ReactiveFormsModule, FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SaarWizardComponent } from '../saar-wizard/saarWizard.component';
import { SAARService } from '../pssl-saar.service';
import { GlobalSharedService } from '../../shared/shared.service';
@Component({
  selector: 'saar-finding',
  templateUrl: './saar-finding.component.html',
  providers: [SAARService]
})
export class SaarFindingComponent{
  public params: any;
  findingName: string;
  findingDesc: string;
  remediation: string;
  severity: string;
  componentName: string;
  findingStatus: string;
  findingComments: string;

  public stillloading = true;
  public records = false;
  public norecords = false;
  public recordsErr = false;
  public saarFindingDetails: Array<any> = [];
  subscription   : any;
  enums      : any;
  psslData   : any;
  _api;
  private hasPermission;
  private readOnly;
  constructor(private api: GlobalSharedService,private _saarService: SAARService, public dialog: MatDialog) {
    this.subscription    = this.api.getData('pssl').subscribe( _psslData => {
            this.psslData = _psslData;
        });
    this.subscription    = this.api.getData('enums').subscribe( _enumsData => {
            this.enums = _enumsData;
        });
  }
  loadSaar(){
      this.getSaarFindingDetails();
  }
  getSaarFindingDetails(){
    this.stillloading = true;
    this.records = false;
    this.norecords = false;
    this._saarService.getSaarDetails(this.psslData).subscribe((res) => {
      const headers = res.headers;
      const data = res.text().length > 0 ? res.json() : null;
      //this.hasPermission = this.utils.getHttpHeader(res, 'x-permission');
      console.log('x-permission', headers.get('x-permission'));
      if (headers.get('x-permission') === '1') {
        this.hasPermission = true;
      }
      if (headers.get('x-permission') === '2') {
        this.readOnly = true;
      }
      if(Array.isArray(data) && data.length > 0 ){
        this.stillloading = false;
        this.records = true;
        this.norecords = false;
        this.recordsErr = false;
      }else{
        this.stillloading = false;
        this.records = false;
        this.norecords = true;
        this.recordsErr = false;
      }

      this.saarFindingDetails = data;
    }, err => {
        this.stillloading = false;
        this.recordsErr = true;
        this.records = false;
        this.norecords = false;
    });
  }

  openClassicDialog(action?:string,findingId?:string) {
    let dialogRef = this.dialog.open(SaarWizardComponent, {
      data: {
        id: this.psslData.id,
        saId: this.psslData.saId,
        applicationId: this.psslData.applicationId,
        enums: this.enums,
        findingId: findingId,
        action: action
      }
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      this.getSaarFindingDetails();
    });
  }
}
