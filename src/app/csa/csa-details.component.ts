import {Component, OnInit, Input, OnChanges} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { CSAService } from './csa.service';
import {DialogsService} from '../shared/modal/dialogs.service';
import { GlobalSharedService } from '../shared/shared.service';
@Component({
  templateUrl: 'csa-details.component.html',
  styleUrls: ['./csa-details.component.css'],
  providers: [CSAService, DialogsService]
})
export class CSADetailsComponent implements OnInit {
  public stillloading = false;
  public records = true;
  public norecords = false;
  public recordsErr = false;
  public csaDetails: Array<any> = [];
  public resultFromModal: any;
  showTeamStats = false;
  showStyle: false;
  actnsComp = 'csa-actions';
  reloadCSAList;
  teams;
  constructor(private sharedService: GlobalSharedService,
              private _csaService: CSAService,
              public dialog: MatDialog,
              private router: Router,
              private dialogsService: DialogsService
              ) {
  }

  ngOnInit() {
    this.sharedService.getData('csaModalClose').subscribe( _csaData => {
        this.reloadCSAList =  _csaData;
        if (this.reloadCSAList === 'reloadCSAList') {
            this.getCSADetails();
        }
    });
    this.getCSADetails();
  }

  public openDialog(id?: number, camrId?: number, actionId?: number, isViewDisabled?: boolean, currentStatus?: number) {
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
                  id: id,
                  currentStatus: currentStatus,
                  camrId: camrId,
                  actionId: actionId,
                  isViewDisabled: isViewDisabled,
                  formId: 'main'
                },
                compName: 'csa'
            }
        ]
      }
    };
    // console.log("modalConfig",modalConfig)
    this.dialogsService
      .openDialog('Cloud Security Management Questionnaire', 'message to modal', modalConfig)
      .subscribe(res => {
        this.resultFromModal = res;
        if (this.resultFromModal !== 'cancel') {
          this.getCSADetails();
        }
        });
    /*
      dialogRef.afterClosed().subscribe(result => {
            this.getCSADetails();
        });
    */
  }
  getCSADetails() {
    this.stillloading = true;
    this.records = false;
    this.norecords = false;
    this._csaService.getCSADetails().subscribe((data) => {
      // console.log("data>>>", Object.keys(data).length);
      if (data.cloudSecurityAssessmentDOS.length > 0) {
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
      this.csaDetails = data;
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
  mouseEnter(teams: any) {
    this.showTeamStats = true;
    this.teams = teams;
  }

  mouseLeave(div: string) {
    this.showTeamStats = false;
    // console.log('mouse leave :' + div);
  }

  getStyle() {
      if (this.showStyle) {
          return 'on';
      } else {
          return '';
      }
  }
}
