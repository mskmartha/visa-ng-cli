import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KCCWizardComponent } from './wizard/wizard.component';
import { MatDialog } from '@angular/material';
import { KCCService } from './kcc.service';
import {DialogsService} from '../shared/modal/dialogs.service';
import {KCCActionsComponent} from './kcc-actions.component';
import { GlobalSharedService } from '../shared/shared.service';
@Component({
  templateUrl: 'kcc-details.component.html',
  styleUrls: ['./kcc-details.component.css'],
  providers: [KCCService, DialogsService]
})
export class KCCDetailsComponent implements OnInit {
  public stillloading = false;
  public records = true;
  public norecords = false;
  public recordsErr = false;
  public kccDetails: Array<any> = [];
  public resultFromModal: any;
  actnsComp = 'kcc-actions';
  reloadKCCList;
  showStyle: false;
  constructor(private _kccService: KCCService,
              public dialog: MatDialog,
              private router: Router,
              private dialogsService: DialogsService,
              private sharedService: GlobalSharedService
              ) {
  }

  ngOnInit() {
    this.sharedService.getData('kccModalClose').subscribe( _csaData => {
        this.reloadKCCList =  _csaData;
        if (this.reloadKCCList === 'reloadKCCList') {
            this.getKCCDetails();
        }
    });
    this.getKCCDetails();
  }

  public openDialog(id?: number, camrId?: number, actionId?: number, pmm?: boolean, isViewDisabled?: boolean, currentStatus?: number) {
    // console.log(id);
    // modal window config
    const modalConfig: any = {
      disableClose: false,
      width: '80%',
      height: '',
      data: {
        message: 'test message',
        showCancelBttn: true,
        showTitle: true,
        dynComps: [ // required
            {
                data: {
                    id: id || 0, // send 0 for new KCC
                    currentStatus: currentStatus,
                    camrId: camrId,
                    actionId: actionId || 12, // actionId 0 for new KCC
                    isViewDisabled: isViewDisabled,
                    pmm: pmm,
                    formId: 'main'
                },
                compName: 'kcc'
            }
        ]
      }
    };
    this.dialogsService
      .openDialog('KCC Questionnaire', 'message to modal', modalConfig)
      .subscribe(res => {
          this.resultFromModal = res;
          if (this.resultFromModal !== 'cancel') {
            this.getKCCDetails();
          }
        });
    /*
      dialogRef.afterClosed().subscribe(result => {
            this.getKCCDetails();
        });
    */
  }
  getKCCDetails() {
    this.stillloading = true;
    this.records = false;
    this.norecords = false;
    this._kccService.getKCCDetails().subscribe((data) => {
      // console.log("data>>>", Object.keys(data).length);
      if (data.kccAssessmentDOs.length > 0) {
        this.stillloading = false;
        this.records = true;
        this.norecords = false;
        this.recordsErr = false;
      }else {
        this.stillloading = false;
        this.records = false;
        this.norecords = true;
        this.recordsErr = false;
      }
      this.kccDetails = data;
    }, err => {
        this.stillloading = false;
        this.recordsErr = true;
        this.records = false;
        this.norecords = false;
    });
  }
  isEmpty(myObject) {
      for (const key in myObject) {
          if (myObject.hasOwnProperty(key)) {
              return false;
          }
      }

      return true;
  }
    getStyle() {
        if (this.showStyle) {
            return 'on';
        } else {
            return '';
        }
    }
}
