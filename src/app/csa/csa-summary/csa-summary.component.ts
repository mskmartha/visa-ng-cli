import {Component,
    ViewChild,
    ViewChildren,
    OnInit,
    ComponentFactoryResolver,
    ViewContainerRef
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {MatCard, MatTabGroup} from '@angular/material';
import {CSAService} from '../csa.service';
import { GlobalSharedService } from '../../shared/shared.service';
import { CSATeamComponent } from './csa-team.component';
import {Observable, Subject} from 'rxjs/Rx';
import { UtilsService } from '../../shared/utils.service';
@Component({
    selector: 'app-csa-summary',
    templateUrl: './csa-summary.component.html',
    providers: [UtilsService, CSAService],
    styles: [`
        .statusLegend{
            float:right;
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
export class CSASummaryComponent implements OnInit {
    @ViewChild('tabContent', { read: ViewContainerRef })
    tabContent: ViewContainerRef;
    public _selectedIndex = 0;
    CSASummary;
    csaP1TabStatus;
    CSAP1Complete = false;
    public utils: UtilsService;
    public assmntDOsStatus;
    subscription: any;
    csaData: any;
    model;
    defaultTab;
    updateTabStatus;
    constructor(
        private sharedService: GlobalSharedService,
        private _csaService: CSAService,
        private router: Router,
        private utilService: UtilsService,
        private cfr: ComponentFactoryResolver
    ) {
        this.utils = utilService;
        this.subscription    = this.sharedService.getData('csa').subscribe( _csaData => {
            this.csaData = _csaData;
        });
    }
    ngOnInit(): any {
        this.sharedService.getData('manageCsaUpdateTabStatus').subscribe( val => {
            this.updateTabStatus =  val;
            if (this.updateTabStatus === 'update') {
                this.getCSASummaryDetails();
            }
        });
        this.assmntDOsStatus = this.utils.genericStates();
        // set initial tab status
        this.getCSASummaryDetails();
        //this.loadTabContent();
    }
    getCSASummaryDetails() {
        this._csaService.getCSASummary(this.csaData.key.id).subscribe((data) => {
            this.CSASummary = data;
            // load first tab
            this.defaultTab = this.CSASummary.manageSaTeamDOList[0].assessmentTeamId;
            this.loadTabContent();
        }, err => {
        });
    }
    changeTabStatus(csaType) {
        this.getCSASummaryDetails();
    }
    get selectedIndex(): number {
        return this._selectedIndex;
    }
    get csaType(): string {
        return 'CSAP' + (this._selectedIndex + 1);
    }
    set selectedIndex(selectedIndex: number) {
        this._selectedIndex = selectedIndex;
    }

    loadTabContent(tabgroup?: MatTabGroup) {
        let pid;
        if (tabgroup) {
            pid = tabgroup._tabs.find((e, i, a) => i === tabgroup.selectedIndex)
            .content.viewContainerRef.element.nativeElement.dataset.pid;
        }else {
            pid = this.defaultTab;
        }
        const filteredObj = this.CSASummary.manageSaTeamDOList.filter(function(ele){
            return ele.assessmentTeamId === parseInt(pid, 0);
        });

        const factory = this.cfr.resolveComponentFactory(CSATeamComponent);
        this.tabContent.clear();
        this.tabContent.createComponent(factory).instance.model = {
            data: {
              id: this.csaData.key.id,
              action: 7, // from api
              isViewDisabled: this.CSAP1Complete, // from api,
              csaType: this.csaType,
              manageSaTeamDOList: this.CSASummary.manageSaTeamDOList,
              teamId: filteredObj[0].assessmentTeamId,
              stateId: filteredObj[0].stateId,
              statusMessage: filteredObj[0].statusMessage,
              defaultTab: this.defaultTab
            }
        };
    }
    statusColor(assessmentTeamId: any, stateId: any) {
        return this.assmntDOsStatus[stateId].color;
    }
}
