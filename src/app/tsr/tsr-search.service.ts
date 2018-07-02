import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable, Input } from '@angular/core';
import 'rxjs/Rx';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import { HttpClient } from '../shared/http.client';

@Injectable()
export class TSRSearchService {
  dataChange: BehaviorSubject<TableData[]> = new BehaviorSubject<TableData[]>([]);
  constructor(private _http: HttpClient) {
  }
  get url() {
      return `/tsr-services/search`;
  }
  getTSRGroup() {
      return this._http.get(`/tsr-services/types`)
      .map(response => response.text().length > 0 ? response.json() : null);
  }
  getTSRSearch(tsrGroupId: string, tsrTypeId: string, keyword: string) {
    if (tsrTypeId === '' || null) {
      tsrTypeId = '0';
    }
    return this._http.get(`/tsr-services/search?tsrGroupId=${tsrGroupId}&tsrTypeId=${tsrTypeId}&keyword=${keyword}`)
      .map(response => response.text().length > 0 ? response.json() : null);
  }
  get data(): TableData[] { return this.dataChange.value; }
}

export interface TableData {
  id: number;
  tsrTitle: string;
  tsrRequirement: string;
  rational: string;
  keyControl: string;
  pcidss: string;
  createdBy: string;
  creationDate: string;
  lastModifiedBy: string;
}

export interface TSRApi {
  content: TableData[];
  totalElements: number;
}
