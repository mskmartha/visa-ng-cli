import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AppScopingService } from './pssl-appscoping.service';
import {FeatreSrchJiraCompnt} from './feature-search-jira/feature-search-jira.component';
import {TableData} from './tableData';
import { GlobalSharedService } from '../shared/shared.service';
import {FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { UtilsService } from '../shared/utils.service';
@Component({
  selector: 'app-pssl-appscoping',
  templateUrl: './pssl-appscoping.component.html',
  styleUrls: ['./pssl-appscoping.component.css'],
  providers: [AppScopingService, UtilsService]
})


export class PSSLAppScopeComponent implements OnInit {
  @Output() tabStatusEvent = new EventEmitter();
  filteredItems: TableData[];
  editedItems: TableData[] = [];
  pages = 4;
  pageSize = 10;
  pageNumber = 0;
  currentIndex = 1;
  items: TableData[];
  pagesIndex: Array<number>;
  pageStart = 1;

  findingName: string;
  findingDesc: string;
  remediation: string;
  severity: string;
  componentName: string;
  hasJiraFeatures = false;
  tablePagination = false;
  public showProgess = true;
  public records = false;
  public norecords = false;
  public appScopeCompleted = false;
  public submitAppScopeSuccess = false;
  public errOnSubmit = false;
  public recordsErr = false;
  editRowId: any;
  subscription: any;
  enums: any;
  genericSeverityRatings: any;
  psslData: any;
  public featuresForm: FormGroup;
  public utils: UtilsService;
  private hasPermission;
  private readOnly;
  constructor(
    private api: GlobalSharedService,
    private _appscopeService: AppScopingService,
    public dialog: MatDialog,
    private router: Router,
    private _fb: FormBuilder,
    private utilService: UtilsService
  ) {
    this.utils = utilService;
    this.subscription    = this.api.getData('pssl').subscribe( _psslData => {
        this.psslData = _psslData;
    });
    this.subscription    = this.api.getData('enums').subscribe( _enumsData => {
      this.enums = _enumsData;
      this.genericSeverityRatings = this.enums.genericSeverityRatings;
    });
  }
  ngOnInit() {
    this.appscopingdetails();
  }
  initAddFindings(id, key, manualFeature, summary, networkChanges, authFlow, dataFlow, severity, comments, ranKey) {
      const fb = this._fb.group({
        'id': [id],
        'key': [key, manualFeature ? Validators.required : ''],
        'summary': [summary, manualFeature ? Validators.required : ''],
        'networkChanges': [{ value: networkChanges, disabled: this.appScopeCompleted ? true : false}],
        'authFlow': [{ value: authFlow, disabled: this.appScopeCompleted ? true : false}],
        'dataFlow': [{ value: dataFlow, disabled: this.appScopeCompleted ? true : false}],
        'manualFeature': [manualFeature],
        'severity': [{ value: severity, disabled: this.appScopeCompleted ? true : false}, manualFeature ? Validators.required : ''],
        'comments': [comments],
        'ranKey': [ranKey]
      });
      fb.valueChanges.subscribe(control => {
        this.editedItems = this.editedItems.filter(function( obj ) {
            return obj.ranKey !== control['ranKey'];
        });
        this.editedItems.push(control);
        // console.log("this.editedItems", this.editedItems)
      });
      fb.disable();
      if (this.hasPermission && !this.appScopeCompleted) {
        fb.enable();
        this.editedItems = [];
      }
      return fb;
  }
  addFindings(id, key, manualFeature, summary, networkChanges, authFlow, dataFlow, severity, comments, ranKey) {
      const control = <FormArray>this.featuresForm.controls['ldrFindingsDOList'];
      control.push(this.initAddFindings(id, key, manualFeature, summary, networkChanges, authFlow, dataFlow, severity, comments, ranKey));
  }

  init() {
        // pagination settings
        this.currentIndex = 1;
        this.pageStart = 1;
        this.pages = 4;
        // todo remove pagination related stuff from this file
        this.pageNumber = parseInt(''+ (this.filteredItems.length / this.pageSize));
        if (this.filteredItems.length % this.pageSize !== 0) {
          this.pageNumber ++;
        }
        if (this.pageNumber  < this.pages) {
              this.pages =  this.pageNumber;
        }
        this.refreshItems();
  }
  fillArray(): any {
    const obj = new Array();
    for (let index = this.pageStart; index < this.pageStart + this.pages; index ++) {
                obj.push(index);
    }
    return obj;
  }
  refreshItems() {
      this.items = this.filteredItems.slice((this.currentIndex - 1) * this.pageSize, (this.currentIndex) * this.pageSize);
      this.pagesIndex =  this.fillArray();
  }

  openClassicDialog(forceSync?: string) {
    // call parent function in pssl-summary, set InProgress
    this.tabStatusEvent.next();
    const dialogRef = this.dialog.open(FeatreSrchJiraCompnt, {
      data: {
        id: this.psslData.id,
        saId: this.psslData.saId,
        camrId: this.psslData.camrId,
        jiraId: null,
        forceSync: forceSync
      }
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      this.appscopingdetails();
    });
  }
  appscopingdetails() {
    this.submitAppScopeSuccess = false;
    this.records = false;
    this.norecords = false;
    this.showProgess = true;
    this._appscopeService.appscopingdetails(this.psslData).subscribe((res) => {
      const headers = res.headers;
      const data = res.text().length > 0 ? res.json() : null;
      // this.hasPermission = this.utils.getHttpHeader(res, 'x-permission');
      console.log('x-permission', headers.get('x-permission'));
      if (headers.get('x-permission') === '1') {
        this.hasPermission = true;
      }
      if (headers.get('x-permission') === '2') {
        this.readOnly = true;
      }
      // backend passes null instead of empty object
      // if(Object.keys(data.jiraIssueFeaturesDOS).length > 0){
      this.featuresForm = this._fb.group({});
      this.processData(data);
    }, err => {
        this.showProgess = false;
        this.recordsErr = true;
        this.records = false;
        this.norecords = false;
    });
  }
  resetFormControls() {
    // this.featuresForm.controls['ldrFindingsDOList'] = this._fb.array([]);
    // this.filteredItems = [];
    this.editedItems = [];
    this.editRowId = '';
  }
  processData(data) {
    this.featuresForm = this._fb.group({
        ldrFindingsDOList: this._fb.array([
            // this.initAddFindings(),
        ])
    });
    if (data.statusId === 5) {
      this.appScopeCompleted = true;
    }
    if (data.jiraIssueFeaturesDOS !== null && data.jiraIssueFeaturesDOS.length > 0) {
        if (data.jiraIssueFeaturesDOS.length >= this.pageSize ) {
          this.tablePagination = true;
        }
        data.jiraIssueFeaturesDOS.forEach(element => {
          if (element.manualFeature === false) {
            this.hasJiraFeatures = true;
          }
          this.addFindings(element.id, element.key, element.manualFeature,
            element.summary, element.networkChanges, element.authFlow, element.dataFlow,
            element.severity, element.comments, element.id);
          this.filteredItems = data.jiraIssueFeaturesDOS;
          this.init();
        });
        // console.log(this.tableData);
        this.showProgess = false;
        this.records = true;
        this.norecords = false;
        this.recordsErr = false;
      }else {
        this.filteredItems = [];
        this.showProgess = false;
        this.records = false;
        this.norecords = true;
        this.recordsErr = false;
      }
  }
  onRowClick(event, id) {
    // console.log(event.target.outerText, id);
  }
  isEmpty(myObject) {
      for (const key in myObject) {
          if (myObject.hasOwnProperty(key)) {
              return false;
          }
      }

      return true;
  }
  changeAction(id: number) {
    // console.log("Inside changeAction...", id);
  }
  addManualFeatures() {
    // call parent function in pssl-summary, set InProgress
    const ranKey = Math.random().toString(36).substring(7);
    const row = new TableData(null, '', '', false, false, false, true, null, '', true, ranKey);
    this.filteredItems.unshift(row);
    // /id, key, manualFeature, summary, networkChanges, authFlow,dataFlow,severity, comments, ranKey
    this.addFindings(0, null, true, null, false, false, false, null, null, ranKey);
    this.editRowId = ranKey;

    this.showProgess = false;
    this.records = true;
    this.norecords = false;
    this.recordsErr = false;
    // this.editRowId = '';
    // this.init();
    // this.addFindings('','','');
  }

  saveAppScopefeatures() {
    // this.editRowId = '';
    event.stopPropagation();
    this.psslData.action = 1;
    this.showProgess = true;
    this.records = false;
    this.norecords = false;
    this.recordsErr = false;
    this._appscopeService.completeAppscoping({'jiraIssueFeaturesDOS': this.editedItems}, this.psslData).subscribe((data) => {
        this.showProgess = false;
        this.records = true;
        this.norecords = false;
        this.recordsErr = false;
        this.tabStatusEvent.next();
        this.resetFormControls();
        this.processData(data);
    }, err => {
        this.showProgess = false;
        this.recordsErr = true;
        this.records = false;
        this.norecords = false;
    });
  }
  submitCompleteAppScope() {
    // this.editRowId = '';
    event.stopPropagation();
    this.psslData.action = 2;
    this.showProgess = true;
    this.records = false;
    this.norecords = false;
    this.recordsErr = false;
    this._appscopeService.completeAppscoping({}, this.psslData).subscribe((data) => {
        this.showProgess = false;
        this.records = false;
        this.norecords = false;
        this.recordsErr = false;
        this.appScopeCompleted = true;
        this.submitAppScopeSuccess = true;
        this.tabStatusEvent.next();
    }, err => {
        this.showProgess = false;
        this.errOnSubmit = true;
        this.showProgess = false;
        this.recordsErr = false;
        this.records = false;
        this.norecords = false;
    });
  }
  showFeatures() {
    this.submitAppScopeSuccess = false;
    this.errOnSubmit = false;
    this.records = true;
  }
  toggle(formGroup) {
    if (!this.hasPermission || this.appScopeCompleted) {
      return;
    }else {
      this.editRowId = formGroup.controls.ranKey.value;
    }
  }
}
