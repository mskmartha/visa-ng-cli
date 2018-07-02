import { Component, Input, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {MatPaginator, MatSort } from '@angular/material';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import { TableService } from './tables.service';
import { Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../http.client';

/**
 * Data source for data to be rendered in the table.
 */
@Component({
  selector: 'app-dynamic-table',
  templateUrl: './tables.common.component.html',
  providers: [TableService]
})
export class TableDataSourceComponent extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }
  _table: TableService | null;
  filteredData: any[] = [];
  renderedData: any[] = [];
  getFromApi = true;
  pageable;
  url;

  totalElements = 0;
  pageableNumber = 0;
  isLoadingResults = false;
  isRateLimitReached = false;
  constructor(private _dataService, // api specific services
              private _paginator: MatPaginator, // table pagination
              private _sort: MatSort, // column sorting
              private _sortBE: boolean, // backend sorting true or false
              private _params: any, // comp specific params
              private _pageable: any,  // pageable params
              private _http: HttpClient // http
              ) {
    super();
    this._table = new TableService(_http);


    if (this._sortBE) {
      this.pageable = this._pageable;
    }
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    this.url = this._dataService.url;
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      // this._dataService.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page,
    ];


    this._sort.sortChange.subscribe(() => {
      // If the user changes the sort order, reset back to the first page.
      this.pageable.page = 0;

      this.pageable.sort = this._sort.active + ',' + this._sort.direction;
      // console.log(JSON.stringify(this.pageable))
    });
    this._paginator.page.subscribe(() => {
      this.pageable.size = this._paginator.pageSize;
      this.pageable.page = this._paginator.pageIndex;
      // console.log(JSON.stringify(this.pageable))
    });

    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    this._paginator.pageIndex = 0;
    return Observable.merge(...displayDataChanges)
        .startWith(null)
        .switchMap(() => {
          this.isLoadingResults = true;
          const tableData = this._table.getTableData(this.url, this._params, this.pageable);
          return tableData;
        })
        .map(res => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.totalElements = res.totalElements;
          this.pageableNumber = res.number;
          this.renderedData = res.content;
          return res.content;
          ;
        })
        .catch(() => {
          // Catch errs
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return Observable.of(null);
        });

  }

  disconnect() {}
}
