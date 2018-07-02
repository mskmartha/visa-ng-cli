import {Component, Injector, OnInit} from '@angular/core';
import { CSAService } from './csa.service';
import { Router } from '@angular/router';
import {DialogsService} from '../shared/modal/dialogs.service';
import { GlobalSharedService } from '../shared/shared.service';
import { UtilsService } from '../shared/utils.service';
@Component({
  selector: 'app-csa-actions',
  template: `
    <!--<div>{{showNum}}{{id}}{{saId}}{{camrId}}</div>-->
    <mat-spinner class="menu-loading" *ngIf="!key && !actnsErr"></mat-spinner>
    <div *ngIf="key && key.length > 0">
      <button class="mat-menu-btn" *ngFor="let lc of key" value={{lc.id}} #status mat-menu-item (click)="csaActions(saInfo, key, lc.id)">
        <mat-icon>find_in_page</mat-icon>
        <span class="mat-menu-span">{{lc.name}}</span>
      </button>
    </div>
    <div *ngIf="key && key.length === 0">
        <mat-icon class="material-icons mat-18">notifications_none</mat-icon>
        <span class="mat-menu-span">No Actions</span>
    </div>
    <div *ngIf="actnsErr">
      <mat-icon class="material-icons mat-18 text-danger">error</mat-icon>
      <span class="mat-menu-span text-danger">Error</span>
    </div>
  `,
  providers: [CSAService, DialogsService, UtilsService]
})
export class CSAActionsComponent implements OnInit {
  showNum = 0;
  id;
  saId;
  camrId;
  key;
  saInfo;
  csaActnsMap;
  public utils: UtilsService;
  actnsErr = false;
  constructor(private injector: Injector,
    private router: Router,
    private _csaService: CSAService,
    private dialogsService: DialogsService,
    private sharedService: GlobalSharedService,
    private utilService: UtilsService
) {
    this.utils = utilService;
  }
  ngOnInit() {
    this.saInfo = {
      id: this.injector.get('id'),
      saId: this.injector.get('saId'),
      camrId: this.injector.get('camrId'),
      isPMM: this.injector.get('isPMM'),
      statusId: this.injector.get('statusId')
    };
    this.showNum = this.injector.get('showNum');
    // this.csaActnsMap = this.utils.saActions();
    // pass id
    this._csaService.getCSAActions(this.saInfo.id, this.saInfo.camrId, 4).subscribe((data) => {
        this.actnsErr = false;
        this.key = data.lifeCycleActionsDOS;
    }, err => {
        this.actnsErr = true;
    });
  }
  public openDialog(id?: number, saId?: string, camrId?: number, actionId?: number, pmm?: boolean, isViewDisabled?: boolean, currentStatus?: number) {
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
                    id: id || 0, // send 0 for new CSA
                    saId: saId || '',
                    currentStatus: currentStatus,
                    camrId: camrId,
                    actionId: actionId || 12, // actionId 0 for new CSA
                    isViewDisabled: isViewDisabled,
                    pmm: pmm,
                    formId: 'main'
                },
                compName: 'csa'
            }
        ]
      }
    };
    this.dialogsService
      .openDialog('CSA Questionnaire', 'message to modal', modalConfig)
      .subscribe(res => {
        const resultFromModal: any = res;
        if (resultFromModal !== 'cancel') {
          this.sharedService.saveData('csaModalClose', 'reloadCSAList');
        }
        });
    /*
      dialogRef.afterClosed().subscribe(result => {
            this.getCSADetails();
        });
    */
  }

  csaActions(saInfo, key, lifeCycleId) {
    event.stopPropagation();
    switch (lifeCycleId) {
      case 2: {// manage csa
            this.sharedService.saveData('csa', {key: saInfo});
            sessionStorage.setItem('csa', JSON.stringify({key: key}));
            this.router.navigate(['/CSA/manage']);
            break;
      }
      case 1: {// view csa
          this.openDialog(saInfo.id, this.saInfo.saId, saInfo.camrId, lifeCycleId, saInfo.isPMM, true, saInfo.statusId);
          break;
      }
      case 3: {// edit csa
          this.openDialog(saInfo.id, this.saInfo.saId, saInfo.camrId, lifeCycleId, saInfo.isPMM, false, saInfo.statusId);
          break;
      }
      default: {
          break;
      }
    }
  }
}
