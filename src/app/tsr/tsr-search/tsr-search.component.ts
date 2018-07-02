import {Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import {MatPaginator, MatSort } from '@angular/material';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { TSRSearchService } from '../tsr-search.service';
import { TableDataSourceComponent } from '../../shared/tables/tables.common.component';
import { Response } from '@angular/http';
import {TSRGroups} from '../tsrGroups';
import {TSRTypes} from '../tsrTypes';
import {NgForm, FormsModule, ReactiveFormsModule, FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {TSRWizardComponent} from '../tsr-wizard/tsr-wizard.component';
import { MatDialog } from '@angular/material';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import * as Meta from './meta.json';
import { HttpClient } from '../../shared/http.client';
@Component({
  selector: 'app-tsr-search',
  styleUrls: ['tsr-search.component.css'],
  templateUrl: 'tsr-search.component.html',
  providers: [TSRSearchService]
})
export class TSRSearchComponent implements OnInit {
  displayedColumns = [];
  dataService: TSRSearchService | null;
  selection = new SelectionModel<string>(true, []);
  dataSource: TableDataSourceComponent | null;
  sortBE = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  public tsrForm: FormGroup;
  selectedGroup = '';
  tsrGroupsDetails;
  tsrGrpMap;
  types: any[];
  public tsrGroupId: string;
  public tsrTypeId: string;
  parsedGroupData = [];
  parsedData = [];
  filteredDataLength = 0;
  renderedDataLength = 0;
  queryParams; // api sepecific params
  pageable; // data table pageable params
  meta: any = {
    attributes: []
  };
  public tableMeta = <any>Meta;
  //
  constructor(private _tsrSearchService: TSRSearchService, private _http: HttpClient, private _fb: FormBuilder, public dialog: MatDialog) {}

  ngOnInit() {
    // console.log("tsrMeta",this.tableMeta);
    this.sortBE = this.tableMeta.sortBE;
    this.tableMeta.columns.forEach(element => {
      if (element.display) {
        this.meta.attributes.push(element);
        this.displayedColumns = this.meta.attributes.map(x => x.name);
      }
    });
    this.tsrForm = this._fb.group({
        keyword: [''],
        tsrGroup: [''],
        tsrType: ['']
    });

    this._tsrSearchService.getTSRGroup().subscribe((groupData) => {
      this.tsrGroupsDetails = groupData.tsrGroups;

      class TSRGroups {
          constructor(
              private id: number,
              private name: string,
              private tsrTypes: TSRTypes[] = []
          ) {}
      }
      this.tsrGrpMap = new Map();
      for (let key in this.tsrGroupsDetails) {
          let val = this.tsrGroupsDetails[key].id;
          if (typeof val == "number"){
            this.tsrGrpMap.set(val, new TSRGroups(this.tsrGroupsDetails[key].id, this.tsrGroupsDetails[key].name, this.tsrGroupsDetails[key].tsrTypes));
          }
      }
    });
  }
  isAllSelected(): boolean {
    if (!this.dataSource) { return false; }
    if (this.selection.isEmpty()) { return false; }

    if (this.filter.nativeElement.value) {
      return this.selection.selected.length === this.dataSource.renderedData.length;
    } else {
      return this.selection.selected.length === this.dataService.data.length;
    }
  }

  masterToggle() {
    if (!this.dataSource) { return; }

    if (this.isAllSelected()) {
      this.selection.clear();
    } else if (this.filter.nativeElement.value) {
      this.dataSource.renderedData.forEach(data => this.selection.select(data.id));
    } else {
      // this.dataService.data.forEach(data => this.selection.select(data.id));
    }
  }
  viewTSR(row) {
    const dialogRef = this.dialog.open(TSRWizardComponent, {
      data: row
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {});
  }

  loadTSR() {
    this.dataService = new TSRSearchService(this._http);
    this.dataSource = new TableDataSourceComponent(
      this.dataService!,
      this.paginator,
      this.sort,
      this.sortBE,
      this.queryParams,
      this.pageable,
      this._http);
    // console.log('dataSource', this.dataSource);
    this.filteredDataLength = this.dataSource.filteredData.length;
    this.renderedDataLength = this.dataSource.renderedData.length;
    /*
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          if (!this.dataSource) { return; }
          this.dataSource.filter = this.filter.nativeElement.value;
        });
     */
  }

  onTSRSearch() {
    // send component specific params to the common component
    this.queryParams = {
      tsrGroupId: this.tsrForm.value.tsrGroup,
      tsrTypeId: this.tsrForm.value.tsrType,
      keyword: this.tsrForm.value.keyword
    };
    this.pageable = {
      page: this.tableMeta.page,
      size: this.tableMeta.size,
      sort: this.tableMeta.mdSortActive + ',' + this.tableMeta.mdSortDirection
    };
    this.loadTSR();
  }

  tsrChange(type) {
    this.types = this.tsrGrpMap.get(Number(type)) ? this.tsrGrpMap.get(Number(type)).tsrTypes : [];
  }

  generateArray(obj) {
    return Object.keys(obj).map((key) => {
      return obj[key];
    });
  }
}
