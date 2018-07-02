import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { PSSLService } from './pssl.service';
import {DialogsService} from '../shared/modal/dialogs.service';
import { UtilsService } from '../shared/utils.service';
import { GlobalSharedService } from '../shared/shared.service';
import { Subject } from 'rxjs/Rx';
import { FormControl, FormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import * as moment from 'moment';

@Component({
  selector: 'pssl-detail',
  templateUrl: 'pssl-details.component.html',
  styleUrls: ['./pssl-details.component.scss'],
  providers: [PSSLService, DialogsService, UtilsService]
})
export class PSSLDetailsComponent implements OnInit, AfterViewInit {
  public stillloading = false;
  public records = true;
  public norecords = false;
  public recordsErr = false;
  public stillloadingInner = true;
  public norecordsInner = false;
  public recordsErrInner = false;
  filteredRecords = false;
  paginationDetail = new BehaviorSubject(
    {
    length: 10,
    pageIndex: 0,
    pageSize: 10
  });
  @Input() isAdmin = false;
  public psslDetails;
  myDataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  moreDetails;
  public resultFromModal: any;
  reloadSAList;
  departments;
  actnsComp = 'sa-actions';
  dynComps;
  showStyle: false;
  public utils: UtilsService;
  hasPermission;
  selectedRow;
  data: Subject<any> = new Subject();
  @Input() enableEdit = true;
  // Used for column based filter search
  showSearch = false;
  // Form control for the filter inputs
  public psslFilter: FormGroup;
  // Used to generate the column headers and the formControl for the filter
  tableColumns = [
    {header: 'SA ID#', type: 'text', formControlName: 'saId'},
    {header: 'CAMR', type: 'text', formControlName: 'applicationId'},
    {header: 'Department', type: 'text', formControlName: 'deptName'},
    {header: 'Project Name', type: 'text', formControlName: ''},
    {header: 'Application Type', type: 'dropdown', formControlName: 'saType'},
    {header: 'ACM Rating', type: 'dropdown', formControlName: 'acmRatingName'},
    {header: 'SA Rating', type: 'dropdown', formControlName: 'saRatingName'},
    {header: 'State', type: 'dropdown', formControlName: 'secAssessmentStateId'},
    {header: 'Go Live Date', type: 'date', formControlName: ''},
    {header: 'Date Submitted', type: 'date', formControlName: 'creationDate'},
    {header: 'Actions', type: 'actions', formControlName: 'actions'}
  ];
  // Arrays to be used in the dropdown while filtering
  appType = [{type: 'CSA', displayName: 'External'}, {type: 'SA', displayName: 'Internal'}];
  saRating = [];
  state = [];
  filters = [];
  // Used for user filter
  clicked = false;
  engagementUrl = '';
  saUrl = '';
  url = '';
  dateFilter: string;
  constructor(private _psslService: PSSLService,
              public dialog: MatDialog,
              private router: Router,
              private dialogsService: DialogsService,
              private utilService: UtilsService,
              public sharedService: GlobalSharedService,
  ) {
        this.utils = utilService;
    }

    ngOnInit() {
        this.sharedService.getData('saModalClose').subscribe( _csaData => {
            this.reloadSAList =  _csaData;
            if (this.reloadSAList === 'reloadSAList') {
                this.getPSSLDetails();
            }
        });
        this.getPSSLDetails();
        this.dynComps = [ // required
            {
                data: {
                },
                compName: 'sa-actions'
            }
        ];
        this.data.subscribe(arr => {
          const deptMap = this.utils.jsonToStrMap(sessionStorage.getItem('departments'));
          if (arr.length > 0) {
                arr.map((item) => {
                  if (deptMap.has(String(item.departmentId))) {
                      item.departmentId = deptMap.get(String(item.departmentId));
                  } else {
                    item.departmentId = 'Other';
                  }
                  this.myDataSource.paginator = this.paginator;
                  return item;
                });
            }
        });
      this.psslFilter = new FormGroup({
        saId: new FormControl(),
        applicationId: new FormControl(),
        deptName: new FormControl(),
        saType:  new FormControl(null, { updateOn: 'change'}),
        acmRatingName:  new FormControl(null, { updateOn: 'change'}),
        saRatingName:  new FormControl(null, { updateOn: 'change'}),
        secAssessmentStateId:  new FormControl(null, { updateOn: 'change'}),
        creationDate:  new FormControl(null, { updateOn: 'change'})
      }, {updateOn: 'blur'});
      this.psslFilter.valueChanges.subscribe((obj) => {
        let url = '';
        for (const key in obj) {
          // If the object exist
          if (obj[key]) {
            // Perform different operations based on the type of value being string, Array or date
            if (typeof obj[key] === 'string') {
              // To differentiate between the number and string on the applicationId so as to call camrShortName or camrId
              if (key === 'applicationId') {
                url += 'camrFilter' + ':' + obj[key] + ',';
                // For other than camr do the normal ke append
              } else {
                url += key + ':' + obj[key] + ',';
              }
            } else if (Array.isArray(obj[key])) {
              if ( obj[key].length > 0) {
                url += key + ':[' + obj[key] + '],';
              } else {
                this.removeFilter(key);
              }
            } else if (moment(obj[key]).isValid()) { // To check date
              if (this.dateFilter) {
                url += key + (this.dateFilter) + (moment(obj[key]).unix() * 1000) + ','; // Converting into epoch with parameter
              } else {
                url += key + ':' + (moment(obj[key]).unix() * 1000) + ',';
              }
            }
          } else {
            this.removeFilter(key);
          }
        }
        this.saUrl = url;
        this.getPSSLDetails(url);
      });
      this.saRating = JSON.parse(sessionStorage.getItem('enums')).genericSeverityRatings;
      this.state = this.getGenericStates();
    }
  ngAfterViewInit() {
    this.myDataSource.paginator = this.paginator;
    this.myDataSource.sort = this.sort;
  }
  public openDialog(formId: string, id?: number, applicationId?: number, actionId?: number, isViewDisabled?: boolean, currentStatus?: number) {
        // console.log(id);
        // modal window config
        const modalConfig: any = {
        disableClose: false,
        width: '',
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
                    actionId: actionId || 0, // actionId 0 for new SA
                    isViewDisabled: isViewDisabled,
                    formId: formId
                    },
                    compName: 'pssl'
                }
            ]
        }
    };
    this.dialogsService
      .openDialog('SA Questionnaire', 'message to modal', modalConfig)
      .subscribe(res => {
        this.resultFromModal = res;
        if (this.resultFromModal !== 'cancel') {
          this.getPSSLDetails();
        }
        });
  }
  // Used for Engagement filter for user
  userFilterTrigger(controlName: string) {
    if (this.clicked) {
      this.engagementUrl = 'myAssessments:' + this.clicked + ',';
      this.addFilter(controlName);
    } else {
      this.engagementUrl = '';
      this.removeFilter(controlName);
      this.clicked = false;
    }
    this.getPSSLDetails('filter');
  }
  public showAllCamrs(event, sa) {
    console.log(sa);
    const modalConfig: any = {
      disableClose: false,
      width: '500px',
      height: '200px',
      minWidth: '300px',
      data: {
        message: 'test message',
        showCancelBttn: false,
        showTitle: true,
        top: (event.clientY) + 'px',
        left: (event.clientX) + 'px',
        dynComps: [ // required
            {
                data: {
                    camrId: sa.camrId,
                    applicationId: sa.applicationId,
                    applicationName: sa.camrShortName,
                    camrDOS: sa.camrDOS
                },
                compName: 'showAllCamrs'
            }
        ]
      }
    };
    this.dialogsService
      .openDialog(sa.saId + ' CAMRs', 'message to modal', modalConfig)
      .subscribe(res => {
        });
  }
  getPSSLDetails(filter='') {
    if (filter || this.engagementUrl || this.saUrl) {
      filter = this.saUrl + this.engagementUrl;
      // To remove the last comma
      if (filter != null && filter.length > 0) {
        filter = filter.substring(0, filter.length - 1);
      }
    }
    this.stillloading = true;
    this.records = false;
    this.norecords = false;
    this.recordsErr = false;
    this._psslService.getPSSLDetails(filter).subscribe((res) => {
        const headers = res.headers;
        // this.hasPermission = this.utils.getHttpHeader(res, 'x-permission');
        const data = res.text().length > 0 ? res.json() : null;
        console.log('x-permission', headers.get('x-permission'));
      // console.log("data>>>", Object.keys(data).length);
      if (data.securityAssessmentDOs.length > 0) {
        this.stillloading = false;
        this.records = true;
        this.filteredRecords = true;
        this.norecords = false;
        this.recordsErr = false;
        this.data.next(data.securityAssessmentDOs);
      } else {
        this.stillloading = false;
        this.records = false;
        this.norecords = true;
        this.recordsErr = false;
      }
      this.psslDetails = data;
      this.myDataSource.data = this.psslDetails.securityAssessmentDOs;
      this.paginationDetail.next({
        length: 10,
        pageIndex: 0,
        pageSize: 10
      });
    }, err => {
        this.stillloading = false;
        this.recordsErr = true;
        this.records = false;
        this.norecords = false;
    });
  }
  showMoreDetails(key) {
    this.stillloadingInner = true;
    this.selectedRow = key.id;
    key.isEditing = true;
    this._psslService.getMoreDetails(key).subscribe((data) => {
        this.stillloadingInner = false;
        this.norecordsInner = false;
        this.recordsErrInner = false;
        this.moreDetails = data;
    }, err => {
        this.stillloadingInner = false;
        this.recordsErrInner = true;
        this.norecordsInner = false;
    });

  }
  cancelEdit(asset) {
    asset.isEditing = false;
    asset.change = undefined;
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
  // triggered by the event emitter on the pagination so that we know whenever the page changes
  getUpdate(event) {
    this.paginationDetail.next(event);
  }
  // To set the operation to be performed on the Date
  setDateFilter(obj) {
    this.dateFilter = obj;
  }
  addFilter(controlName: string): void {
    const index  = this.filters.indexOf(controlName);
    if (controlName && index === -1) {
      if (controlName === 'userId') {
        this.filters.push(controlName);
      } else if (this.psslFilter.controls[controlName].value && (this.psslFilter.controls[controlName].value.length > 0)){
        this.filters.push(controlName);
      } else if (controlName === 'creationDate') { // To handle the date picker differently as on click it wont have any value
        this.filters.push(controlName);
      }
    }
  }
  removeFilter(filter: any, i?): void {
    if(this.filters.indexOf(filter) >= 0) {
      // Remove if it does exist
      this.filters.splice(this.filters.indexOf(filter), 1);
      // Handle userId different than other filter fields as it doesn't have a form control which gets triggered on changes
      if (i >= 0 && filter !== 'userId') {
        this.psslFilter.controls[filter].setValue(null);
      } else if (filter === 'userId'){
        this.engagementUrl = '';
        this.clicked = false;
        this.getPSSLDetails('filter');
      }
    }

  }
  getGenericStates(): any {
    const res = JSON.parse(sessionStorage.getItem('enums')).genericStates;
    const statesList: GenericStates[] = Object.getOwnPropertyNames(res)
      .map((key: string) => new GenericStates(parseInt(key, 10), res[key]));
    return statesList;
  }
}
class GenericStates {
  constructor(private id: number, private value: string) {}
}
