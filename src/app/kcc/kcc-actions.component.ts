import {Component, Injector} from '@angular/core';
import { KCCService } from './kcc.service';
import { Router } from '@angular/router';
import {DialogsService} from '../shared/modal/dialogs.service';
import { GlobalSharedService } from '../shared/shared.service';
import { UtilsService } from '../shared/utils.service';
@Component({
  selector: 'app-kcc-actions',
  template: `
    <!--<div>{{showNum}}{{id}}{{saId}}{{camrId}}</div>-->
    <mat-spinner class="menu-loading" *ngIf="!key && !actnsErr"></mat-spinner>
    <div *ngIf="key && key.length > 0">
        <button class="mat-menu-btn" *ngFor="let lc of key" value={{lc}} #status mat-menu-item (click)="kccActions(saInfo, key, lc)">
            <mat-icon>{{kccActnsMap.get(lc.toString()).mdIcon}}</mat-icon>
            <span class="mat-menu-span">{{kccActnsMap.get(lc.toString()).name}}</span>
        </button>
    </div>
    <div *ngIf="key && key.length === 0">
        <mat-icon class="material-icons md-18">notifications_none</mat-icon>
        <span class="mat-menu-span">No Actions</span>
    </div>
    <div *ngIf="actnsErr">
      <mat-icon class="material-icons md-18 text-danger">error</mat-icon>
      <span class="mat-menu-span text-danger">Error</span>
    </div>
  `,
  providers: [KCCService, DialogsService, UtilsService]
})
export class KCCActionsComponent {
  showNum = 0;
  id;
  saId;
  camrId;
  key;
  saInfo;
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
    this.saInfo = {
      id: this.injector.get('id'),
      saId: this.injector.get('saId'),
      camrId: this.injector.get('camrId'),
      isPMM: this.injector.get('isPMM'),
      statusId: this.injector.get('statusId')
    };
    this.showNum = this.injector.get('showNum');
    this.kccActnsMap = this.utils.kccActions();
    console.log("kccActnsMap", this.kccActnsMap.get("1").mdIcon)
    // pass id
    this._kccService.getKCCActions(this.saInfo.id, this.saInfo.camrId, 4).subscribe((data) => {
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
            this.sharedService.saveData('kccModalClose', 'reloadKCCList');
          }
        });
    /*
      dialogRef.afterClosed().subscribe(result => {
            this.getKCCDetails();
        });
    */
  }

  kccActions(saInfo, key, lifeCycleId) {
    event.stopPropagation();
    /*
   "kccActions": {
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
	},
    */
    event.stopPropagation();
    console.log('currentStatus', lifeCycleId);
    switch (lifeCycleId) {
        case 1: {
            this.updateKCCstatus(saInfo, lifeCycleId);
            break;
        }
        case 2: {
            this.updateKCCstatus(saInfo, lifeCycleId);
            break;
        }
        case 3: {
            this.updateKCCstatus(saInfo, lifeCycleId);
            break;
        }
        case 5: {// manage kcc
                this.sharedService.saveData('kcc', {key: saInfo});
                sessionStorage.setItem('kcc', JSON.stringify({key: key}));
                this.router.navigate(['/KCC/manage']);
                break;
        }
        case 6: {// view kcc
            this.openDialog(saInfo.id, saInfo.camrId, lifeCycleId, saInfo.isPMM, true, saInfo.statusId);
            break;
        }
        case 7: {
            this.updateKCCstatus(saInfo, lifeCycleId);
            break;
        }
        case 8: {
            this.updateKCCstatus(saInfo, lifeCycleId);
            break;
        }
        case 9: {// edit kcc
            this.openDialog(saInfo.id, saInfo.camrId, lifeCycleId, saInfo.isPMM, false, saInfo.statusId);
            break;
        }
        case 10: {
            break;
        }
        case 11: {
                this.updateKCCstatus(saInfo, lifeCycleId);
                break;
        }
        case 12: {
                this.updateKCCstatus(saInfo, lifeCycleId);
                break;
        }
        case 13: { // complete kcc
            this.updateKCCstatus(saInfo, lifeCycleId);
            break;
        }

        case 14: { // complete kcc
            this.sharedService.saveData('kcc', {key: saInfo});
            sessionStorage.setItem('kcc', JSON.stringify({key: key}));
            this.router.navigate(['/KCC/manage']);
            break;
        }
        case 15: { // complete kcc
            this.sharedService.saveData('kcc', {key: saInfo});
            sessionStorage.setItem('kcc', JSON.stringify({key: key}));
            this.router.navigate(['/KCC/manage']);
            break;
        }

      default: {
          break;
      }
    }
  }
  updateKCCstatus(key, lifeCycleId) {
    this._kccService.updateKCCstatus(key.id, lifeCycleId, 'KCC').subscribe((statusChangedData) => {
        // this.kccDetails = statusChangedData;
        this.sharedService.saveData('kccModalClose', 'reloadKCCList');
    });
  }

}
