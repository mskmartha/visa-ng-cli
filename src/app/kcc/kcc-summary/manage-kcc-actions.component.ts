import {Component, Injector} from '@angular/core';
import { KCCService } from '../kcc.service';
import { Router } from '@angular/router';
import {DialogsService} from '../../shared/modal/dialogs.service';
import { GlobalSharedService } from '../../shared/shared.service';
import { UtilsService } from '../../shared/utils.service';
@Component({
  selector: 'app-manage-kcc-actions',
  template: `
    <!--<div>{{showNum}}{{id}}{{saId}}{{camrId}}</div>-->
    <mat-spinner class="menu-loading" *ngIf="!key && !actnsErr"></mat-spinner>
    <div *ngIf="key && key.length > 0">
        <button class="mat-menu-btn" *ngFor="let lc of key" value={{lc}} #status mat-menu-item (click)="kccActions(kccInfo, key, lc)">
            <mat-icon>{{kccActnsMap.get(lc.toString()).mdIcon}}</mat-icon>
            <span class="mat-menu-span">{{kccActnsMap.get(lc.toString()).name}}</span>
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
  providers: [KCCService, DialogsService, UtilsService]
})
export class ManageKCCActionsComponent {
  showNum = 0;
  id;
  saId;
  camrId;
  key;
  kccInfo;
  kccActnsMap;
  actnsErr = false;
  public utils: UtilsService;
  constructor(private injector: Injector,
    private router: Router,
    private _kccService: KCCService,
    private dialogsService: DialogsService,
    private sharedService: GlobalSharedService,
    private utilService: UtilsService
) {
    this.utils = utilService;
    this.kccInfo = {
        kccType: this.injector.get('kccType'),
        kccTypeId: this.injector.get('kccTypeId'),
        id: this.injector.get('id'),
        saId: this.injector.get('saId'),
        camrId: this.injector.get('camrId'),
        isPMM: this.injector.get('isPMM'),
        statusId: this.injector.get('statusId')
    };
    // console.log('this.kccInfo',this.kccInfo);
    this.showNum = this.injector.get('showNum');
    this.kccActnsMap = this.utils.kccActions();
    // pass id
    this._kccService.getKCCActions(this.kccInfo.id, this.kccInfo.camrId, this.kccInfo.kccTypeId).subscribe((data) => {
        this.actnsErr = false;
        this.key = data.actions;
    }, err => {
        this.actnsErr = true;
    });
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
        const resultFromModal: any = res;
        if (resultFromModal !== 'cancel') {
          this.sharedService.saveData('manageKccUpdateTabStatus', 'update');
        }
        });
    /*
      dialogRef.afterClosed().subscribe(result => {
            this.getKCCDetails();
        });
    */
  }
  kccActions(kccInfo, key, lifeCycleId) {
        event.stopPropagation();
        /*
        "1": "Pause",
		"2": "Resume",
		"3": "Abandon",
		"5": "Manage KCC",
		"6": "View KCC",
		"7": "Need More Info",
		"8": "Accept",
		"9": "Edit",
		"10": "Save",
		"11": "In Review",
		"12": "Submit",
		"13": "Complete KCC",
		"14": "View Pre-PPR",
		"15": "View Pre-PIR",
		"16": "Unkonwn"

        */
        event.stopPropagation();
        // console.log('currentStatus', currentStatus);
        switch (lifeCycleId) {
            case 1: {
                this.updateKCCstatus(kccInfo, key, lifeCycleId);
                break;
            }
            case 2: {
                this.updateKCCstatus(kccInfo, key, lifeCycleId);
                break;
            }
            case 3: {
                this.updateKCCstatus(kccInfo, key, lifeCycleId);
                break;
            }
            case 5: {// manage kcc
                break;
            }
            case 6: {// view kcc
                this.updateKCCstatus(kccInfo, key, lifeCycleId);
                break;
            }
            case 7: { // need more info
                this.updateKCCstatus(kccInfo, key, lifeCycleId);
                break;
            }
            case 8: {
                this.updateKCCstatus(kccInfo, key, lifeCycleId);
                break;
            }
            case 9: {// edit kcc
                break;
            }
            case 10: {
                break;
            }
            case 11: {
                this.updateKCCstatus(kccInfo, key, lifeCycleId);
                break;
            }
            case 13: { // complete kcc
                this.updateKCCstatus(kccInfo, key, lifeCycleId);
                break;
            }
            default: {
                break;
            }
        }
    }
    updateKCCstatus(kccInfo, key, lifeCycleId) {
        this._kccService.updateKCCstatus(kccInfo.id, lifeCycleId, kccInfo.kccType)
        .subscribe((statusChangedData) => {
            this.sharedService.saveData('manageKccUpdateTabStatus', 'update');
        });
    }

}
