import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable, Input } from '@angular/core';
import { Response, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/Rx';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import { HttpClient } from '../http.client';

@Injectable()
export class TableService {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  constructor(private _http: HttpClient) {
  }

  getTableData(url, queryParams?: any, pageable?: any) {
    // build query params from api params and pageable
    const params: URLSearchParams = new URLSearchParams();
    for (var key in queryParams) {
        params.set(key, queryParams[key]);
    }
    for (var key in pageable) {
        params.set(key, pageable[key]);
    }
    const requestOptions = new RequestOptions();
    requestOptions.search = params;
    return this._http.getWithReqOptions(url, requestOptions)
    .map(response => response.text().length > 0 ? response.json() : null);
  }
  get data(): any[] {
      // this.dataChange.next([]);
      return this.dataChange.value;
  }


}
