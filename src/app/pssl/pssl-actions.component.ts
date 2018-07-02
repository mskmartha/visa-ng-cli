import {Component, Injector} from '@angular/core';
import { PSSLService } from './pssl.service';
import { Router } from '@angular/router';
import {DialogsService} from '../shared/modal/dialogs.service';
import { GlobalSharedService } from '../shared/shared.service';
import { UtilsService } from '../shared/utils.service';
@Component({
  selector: 'app-pssl-actions',
  templateUrl: `./pssl-actions.component.html`,
  providers: [PSSLService, DialogsService, UtilsService]
})
export class PSSLActionsComponent {
  showNum = 0;
  id;
  saId;
  applicationId;
  key;
  saInfo;
  saActions;
  public resultFromModal: any;
  public utils: UtilsService;
  actnsErr = false;
  constructor(private injector: Injector, private router: Router,
        private _psslService: PSSLService,
        private dialogsService: DialogsService,
        private sharedService: GlobalSharedService,
        private utilService: UtilsService
    ) {
        this.utils = utilService;
        this.saInfo = {
            id: this.injector.get('id'),
            saType: this.injector.get('saType'),
            saId: this.injector.get('saId'),
            applicationId: this.injector.get('applicationId'),
            releaseName: this.injector.get('releaseName'),
            releaseDate: this.injector.get('releaseDate'),
            saRating: this.injector.get('releaseDate'),
            statusId: this.injector.get('statusId'),
          };
          this.showNum = this.injector.get('showNum');
          this.saActions = this.utils.saActions();
          // pass id
          this._psslService.getSAActions(this.saInfo.id, this.saInfo.applicationId).subscribe((data) => {
              this.actnsErr = false;
              // console.log('getSAActions>>>', data);
              this.key = data.actions;
          }, err => {
              this.actnsErr = true;
          });
  }

  public openDialog(formId: string, id?: number, title?: string, applicationId?: number, saType?: string, actionId?: number, isViewDisabled?: boolean, currentStatus?: number) {
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
                  id: id || 0,
                  currentStatus: currentStatus,
                  applicationId: applicationId,
                  saType: saType,
                  actionId: actionId || 0, // actionId 0 for new SA
                  isViewDisabled: isViewDisabled,
                  formId: formId
                },
                compName: 'pssl'
            }
        ]
      }
    };
    // console.log("modalConfig",modalConfig)
    this.dialogsService
      .openDialog(title, 'message to modal', modalConfig)
      .subscribe(res => {
        const resultFromModal: any = res;
        if (resultFromModal !== 'cancel') {
          this.sharedService.saveData('saModalClose', 'reloadSAList');
        }
        });
    /*
      dialogRef.afterClosed().subscribe(result => {
            this.getPSSLDetails();
        });
    */
  }

  psslActions(saInfo, key, lifeCycleId) {
    // event.stopPropagation();
    switch (lifeCycleId) {
        /*
        "1": "Start Triage",
        "2": "Abandon",
        "3": "Clone",
        "4": "View Triage",
        "5": "Manage SA",
        "6": "View SA",
        "7": "View SA Workflow",
        "8": "Unknown",
        "9": "Start Scoping",
        "10": "View Scoping",
        "11": "Edit Scoping"
        */
        // SA Triage
        case 1: { // start SA Triage
            this.openDialog('SAT', saInfo.id, saInfo.saId + ' Triage Questionnaire', saInfo.applicationId, saInfo.saType, lifeCycleId, false, saInfo.statusId);
            break;
        }
        case 2: { // Abandon,
            this.updatePSSLstatus(saInfo, key, lifeCycleId);
            break;
        }
        case 3: { // clone SA
          console.log(saInfo);
          // this.openDialog('SA', 0, 'SA Questionnaire', saInfo.applicationId, lifeCycleId, false);
            this.openDialog('SA', saInfo.id, 'SA Questionnaire', saInfo.applicationId, saInfo.saType, lifeCycleId, false, saInfo.statusId);
            break;
        }
        case 23: {// Edit Triage
          this.openDialog('SAT', saInfo.id, saInfo.saId + ' Triage Questionnaire', saInfo.applicationId, saInfo.saType, lifeCycleId, true, saInfo.statusId);
          break;
        }
        case 4: { // view Triage
            this.openDialog('SAT', saInfo.id, saInfo.saId + ' Triage Questionnaire', saInfo.applicationId, saInfo.saType, lifeCycleId, true, saInfo.statusId);
            break;
        }
        case 5: {
            // manage SA
            this.sharedService.saveData('pssl', {id: saInfo.id, saId: saInfo.saId, applicationId: saInfo.applicationId,
                releaseName: saInfo.releaseName, releaseDate: saInfo.releaseDate, saRating: saInfo.saRatingName, actionId: lifeCycleId});
              sessionStorage.setItem('pssl', JSON.stringify({id: saInfo.id, applicationId: saInfo.applicationId,
                releaseName: saInfo.releaseName, releaseDate: saInfo.releaseDate}));
            this.router.navigate(['/SA/' + saInfo.id + '/manage']);
            break;
        }
        case 6: {// Edit SA / View SA
            this.openDialog('SA', saInfo.id, saInfo.saId + ' Questionnaire', saInfo.applicationId, saInfo.saType, lifeCycleId, true, saInfo.statusId);
            break;
        }
        case 11: {// Edit SA
            this.openDialog('SA', saInfo.id, saInfo.saId + ' Questionnaire', saInfo.applicationId, saInfo.saType, lifeCycleId, false, saInfo.statusId);
            break;
        }
        case 7: {
            // manage SA
            this.sharedService.saveData('pssl', {id: saInfo.id, saId: saInfo.saId, applicationId: saInfo.applicationId,
                releaseName: saInfo.releaseName, releaseDate: saInfo.releaseDate, saRating: saInfo.saRatingName});
              sessionStorage.setItem('pssl', JSON.stringify({id: saInfo.id, applicationId: saInfo.applicationId,
                releaseName: saInfo.releaseName, releaseDate: saInfo.releaseDate}));
            this.router.navigate(['/SA/' + saInfo.id + '/manage']);
            break;
        }
        case 8: {
            break;
        }
        case 20: {
          // Start Scoping
          this.openDialog('SAS', saInfo.id, saInfo.saId + ' Scoping Questionnaire', saInfo.applicationId, saInfo.saType, lifeCycleId, false, saInfo.statusId);
          break;
        }
        case 21: {
          // View Scoping
          this.openDialog('SAS', saInfo.id, saInfo.saId + ' Scoping Questionnaire', saInfo.applicationId, saInfo.saType, lifeCycleId, true, saInfo.statusId);
          break;
        }
        case 22: {// Edit Scoping
          this.openDialog('SAS', saInfo.id, saInfo.saId + ' Scoping Questionnaire', saInfo.applicationId, saInfo.saType, lifeCycleId, true, saInfo.statusId);
          break;
        }
        default: {
            break;
        }
    }
  }
  updatePSSLstatus(saInfo, key, lifeCycleId) {
    this._psslService.updatePSSLstatus(saInfo.id, saInfo.applicationId, lifeCycleId, 'PSSL').subscribe((statusChangedData) => {
        // this.psslDetails = statusChangedData;
        this.sharedService.saveData('saModalClose', 'reloadSAList');
    });
  }

}
