import {Component, ViewChild, ViewChildren, OnInit} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {MatCard, MatTabGroup} from '@angular/material';
import {KCCService} from '../kcc.service';
import { GlobalSharedService } from '../../shared/shared.service';
import { KCCPprPirComponent } from './kcc-ppr-pir.component';
import { UtilsService } from '../../shared/utils.service';
import {ManageKCCActionsComponent} from './manage-kcc-actions.component';
import { KccManageDynComponent } from './kcc-manage-dyn.component';
import {Observable, Subject} from 'rxjs/Rx';
@Component({
    selector: 'app-kcc-summary',
    templateUrl: './kcc-summary.component.html',
    providers: [UtilsService, KCCService],
    styles: [`
        .statusLegend{
            position: absolute;
            right:0;
        }
        .fab-flyout-menu{
            position:absolute;
            right:300px;
        }
        .fab-btn-txt{
            font-size:10px;
        }
        .menu{
            position: absolute;
            right: 30px;
            top: 90px;
            z-index:900;
        }
    `]
})
export class KCCSummaryComponent implements OnInit {
    @ViewChild(KccManageDynComponent) csaTeamChild;
    @ViewChild(KCCPprPirComponent) kccPprChild;
    sharedData: string[] = [];
    public _selectedIndex = 0;
    routeLinks: any[];
    Id: any;
    KCCSummary: any;
    kccP1TabStatus;
    kccP2TabStatus;
    KCCP1Complete = false;
    KCCP2Complete = false;
    public utils: UtilsService;
    public assmntDOsStatus;
    subscription: any;
    kccData: any;
    showStyle: false;
    private hasPermission;
    actnsComp = 'manage-kcc-actions';
    defaultTab = 'KCCP1';
    model: Subject<any> = new Subject();
    updateTabStatus;
    kccP1StatusId;
    kccP2StatusId;
    menuInfo;
    constructor(
        private sharedService: GlobalSharedService,
        private _kccService: KCCService,
        private router: Router,
        private utilService: UtilsService
    ) {
        this.utils = utilService;
        this.KCCSummary = {};
        this.subscription    = this.sharedService.getData('kcc').subscribe( _kccData => {
            this.kccData = _kccData;
        });
    }
    ngOnInit(): any {
        this.sharedService.getData('KCCP1').subscribe( _csaData => {
           // console.log('KCCP1', _csaData);
        });
        this.assmntDOsStatus = this.utils.genericStates();
        // set initial tab status
        this.getKCCSummaryDetails('KCCP1');
        this.getKCCSummaryDetails('KCCP2');

        this.sharedService.getData('manageKccUpdateTabStatus').subscribe( val => {
            this.updateTabStatus =  val;
            if (this.updateTabStatus === 'update') {
                this.getKCCSummaryDetails(this.kccType);
            }
        });
    }
    getKCCSummaryDetails(kccType) {
        this._kccService.getKCCSummary(this.kccData.key.id, kccType).subscribe((res) => {
            const headers = res.headers;
            const data = res.text().length > 0 ? res.json() : null;
            if (headers.get('x-permission') === '1') {
              this.hasPermission = true;
            }
            if (data.statusId === 0 || data.statusId === null) {
                // default to 'Not Started'
                data.statusId = 10;
            }
            if (kccType === 'KCCP1') {
                this.kccP1TabStatus = this.assmntDOsStatus[data.statusId].color;
                // status complete or accepted
                if (data.statusId === 5 || data.statusId === 7) {
                    this.KCCP1Complete = true; // set this from api
                }
                this.KCCSummary = data;
                this.kccP1StatusId = data.statusId;
                console.log("this.kccP1StatusId", this.kccP1StatusId)
                this.menuInfo = {
                    id: this.kccData.key.id,
                    kccType: kccType,
                    kccTypeId: 5,
                    statusId: data.statusId
                };
            }
            if (kccType === 'KCCP2') {
                this.kccP2TabStatus = this.assmntDOsStatus[data.statusId].color;
                // status complete
                if (data.statusId === 7) {
                    this.KCCP2Complete = true; // set this from api
                }
                this.KCCSummary = data;
                this.kccP2StatusId = data.statusId;
                console.log("this.kccP2StatusId", this.kccP2StatusId)
                this.menuInfo = {
                    id: this.kccData.key.id,
                    kccType: kccType,
                    kccTypeId: 6,
                    statusId: data.statusId
                };
            }
            this.loadTabContent();
        }, err => {
        });
    }
    changeTabStatus(kccType) {
        console.log('changeTabStatus KCC');
        this.getKCCSummaryDetails(kccType);
    }
    get selectedIndex(): number {
        return this._selectedIndex;
    }
    get kccType(): string {
        return 'KCCP' + (this._selectedIndex + 1);
    }
    set selectedIndex(selectedIndex: number) {
        this._selectedIndex = selectedIndex;
    }
    canMove(index: string): boolean {
        switch (index) {
            case 'KCCP1':
                return true;
            case 'KCCP2':
                if (this.KCCP1Complete) {
                    return true;
                }else {
                    return false;
                }
            default:
                return false;
        }
    }

    loadTabContent(tabgroup?: MatTabGroup) {
        let pid;
        if (tabgroup) {
            pid = tabgroup._tabs.find((e, i, a) => i === tabgroup.selectedIndex)
            .content.viewContainerRef.element.nativeElement.dataset.pid;
        }else {
            pid = this.defaultTab;
        }
        this.model.next({
            id: this.kccData.key.id,
            isViewDisabled: this.KCCP1Complete, // from api,
            csaType: this.kccType,
            formId: this.kccType,
            statusId: this.getStatusId(this.kccType)
          });
    }
    getStatusId(kccType) {
        if (kccType === 'KCCP1') {
            return this.kccP1StatusId;
        }
        if (kccType === 'KCCP2') {
            return this.kccP2StatusId;
        }
    }
    statusColor(assessmentId: any, statusId: any) {
        return this.assmntDOsStatus[statusId].color;
    }
    getStyle() {
        if (this.showStyle) {
            return 'on';
        } else {
            return '';
        }
    }
}
