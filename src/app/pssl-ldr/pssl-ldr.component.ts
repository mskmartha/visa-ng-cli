import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatCard } from '@angular/material';
import { NgForm } from '@angular/forms';
import { LDRWizardComponent } from './ldr-wizard/ldrWizard.component';
import { MatDialog } from '@angular/material';
import { LLDRService } from './pssl-ldr.service';
import { GlobalSharedService } from '../shared/shared.service';
import { UtilsService } from '../shared/utils.service';

@Component({
  selector: 'pssl-ldr',
  templateUrl: './pssl-ldr.component.html',
  providers: [LLDRService, UtilsService]
})
export class PSSLLdrComponent implements OnInit {
  @Output() tabStatusEvent = new EventEmitter();
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
  public psslDetails: Array<any> = [];
  public ldrLoaded = false;
  subscription: any;
  psslData: any;
  enums: any;
  public utils: UtilsService;
  private hasPermission;
  private readOnly;
  constructor(private api: GlobalSharedService, private _psslService: LLDRService, public dialog: MatDialog, private router: Router, private utilService: UtilsService) {
    this.utils = utilService;
    this.subscription = this.api.getData('pssl').subscribe(_psslData => {
      this.psslData = _psslData;
    });
    this.subscription = this.api.getData('enums').subscribe(_enumsData => {
      this.enums = _enumsData;
    });
  }
  ngOnInit() {
    if (!this.ldrLoaded) {
      this.getLLDRDetails();
    }
    this.ldrLoaded = true;
  }

  openClassicDialog(action?: string, findingId?: string) {
    let dialogRef = this.dialog.open(LDRWizardComponent, {
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
      this.getLLDRDetails();
    });
  }

  openDialogEditSA(findingId) {
    let dialogRef = this.dialog.open(LDRWizardComponent, {
      data: {
        id: this.psslData.id,
        saId: this.psslData.saId,
        applicationId: this.psslData.applicationId,
        findingId: findingId,
        action: 'edit',
      }
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      this.getLLDRDetails();
    });
  }

  getLLDRDetails() {
    this.stillloading = true;
    this.records = false;
    this.norecords = false;
    this._psslService.getLLDRDetails(this.psslData).subscribe((res) => {
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
      console.log('x-permission', this.hasPermission);
      if(Array.isArray(data) && data.length > 0 ){
        this.stillloading = false
        this.records = true;
        this.norecords = false;
        this.recordsErr = false;
        this.tabStatusEvent.next(2);
      } else {
        this.stillloading = false
        this.records = false;
        this.norecords = true;
        this.recordsErr = false;
      }

      this.psslDetails = data;
    }, err => {
      this.stillloading = false
      this.recordsErr = true;
      this.records = false;
      this.norecords = false;
    });
  }
  isEmpty(myObject) {
    for (var key in myObject) {
      if (myObject.hasOwnProperty(key)) {
        return false;
      }
    }

    return true;
  }

  changeAction(id: number) {
  }

}

