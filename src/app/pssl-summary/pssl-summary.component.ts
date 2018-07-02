/**
 * Created by sangkuma on 5/23/17.
 */
import {Component, ViewChild, OnInit, ViewEncapsulation} from '@angular/core';
import { PSSLService } from '../pssl/pssl.service';
import { MatDialog} from '@angular/material';
import {PSSLSummaryService} from './pssl-summary.service';
import { GlobalSharedService } from '../shared/shared.service';
import { PSSLLdrComponent } from '../pssl-ldr/pssl-ldr.component';
import { PSSLSaarComponent } from '../pssl-saar/pssl-saar.component';
import { PSSLCodeScanComponent } from '../pssl-codescan/pssl-codescan.component';
import { UtilsService } from '../shared/utils.service';
import {DialogsService} from '../shared/modal/dialogs.service';
import {environment} from '../../environments/environment';
import { Router, ActivatedRoute} from '@angular/router';
import * as EngagementsConfig from './engagements.config.json';
@Component({
  moduleId: module.id,
  selector: 'app-pssl-summary',
  templateUrl: './pssl-summary.component.html',
  styleUrls: ['./pssl-summary.component.scss'],
  providers: [PSSLService, PSSLSummaryService, UtilsService, DialogsService],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
})
export class PSSLSummaryComponent implements OnInit {
  public engagementsConfig = <any>EngagementsConfig;
  tabLinks = [
  ];
  public indicator: false;

  @ViewChild(PSSLLdrComponent) ldrChild;
  @ViewChild(PSSLSaarComponent) saarChild;
  @ViewChild(PSSLCodeScanComponent) sastChild;
  _api;
  public _selectedIndex = 0;
  params: any;
  Id: any;
  PSSLSummary;

  public utils: UtilsService;
  public assmntDOsStatus;
  subscription: any;
  psslData: any;
  showProgess = true;
  errOnSubmit = false;
  showStyle: false;
  // This SA id is used to get the SA summary
  saId;
  constructor(
    private api: GlobalSharedService,
    private _psslSummaryService: PSSLSummaryService,
    public dialog: MatDialog,
    private utilService: UtilsService,
    private dialogsService: DialogsService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.utils = utilService;
    this._api = this.api;
    this.subscription    = this.api.getData('pssl').subscribe( _psslData => {
      this.psslData = _psslData;
    });
  }
  ngOnInit(): any {
    this.assmntDOsStatus = this.utils.genericStates();
    // each time the saId in the url changes
    this.activatedRoute.params.map(params => params['saId']).subscribe((saId) => {
      // go get the assessment
      this.saId = saId;
      this.router.config[1].children.forEach(route => {
        // dynamic tabs
        route.data = {id: 1};
      });
      this.getPSSLSummaryDetails();
    });
  }
  public openDialog(event, comments?: string) {
    // console.log(id);
    // modal window config
    const modalConfig: any = {
      disableClose: false,
      width: '300px',
      height: '300px',
      data: {
        message: 'test message',
        showCancelBttn: false,
        showTitle: false,
        top: (event.clientY - 300) + 'px',
        left: (event.clientX - 150) + 'px',
        dynComps: [ // required
          {
            data: {
              comments: comments
            },
            compName: 'showMore'
          }
        ]
      }
    };
    // console.log("modalConfig",modalConfig)
    this.dialogsService
      .openDialog('Comments', 'message to modal', modalConfig)
      .subscribe(res => {
      });
  }
  getPSSLSummaryDetails() {
    this.showProgess = true;
    this.errOnSubmit = false;
    this._psslSummaryService.getPSSLSummary(this.psslData).subscribe((data) => {
      this.PSSLSummary = data;
      data.assessmentDOs.forEach(element => {
        // dynamic tabs
        this.tabLinks.push({id: element.assessmentId, label: element.assessment, link: element.assessmentId, statusId: element.statusId});
      });
      // this.PSSLSummary = data;
      this.showProgess = false;
      this.errOnSubmit = false;
    }, err => {
      this.showProgess = false;
      this.errOnSubmit = true;
    });
  }
  tryAgain() {
    this.getPSSLSummaryDetails();
  }
  get selectedIndex(): number {
    return this._selectedIndex;
  }
  set selectedIndex(selectedIndex: number) {
    this._selectedIndex = selectedIndex;
  }
  getStyle() {
    if (this.showStyle) {
      return 'on';
    } else {
      return '';
    }
  }
}
