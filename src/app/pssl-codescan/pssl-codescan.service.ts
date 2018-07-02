import { HttpClient } from './../shared/http.client';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { environment } from '../../environments/environment';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/delay';
@Injectable()
export class PSSLCodeScanService {
    delayMs = 3000; // use for unit test only
    constructor(private _http: HttpClient) {}
    getProjectName(projectName: string) {
      return this._http.get(`/sa-services/sa/sast/scans/odata/${projectName}`)
      // .delay(this.delayMs)
      .map(response => response.text().length > 0 ? response.json() : null);
    }
    saveScanDetail(saId: number, projectName: string, Id: number) {
      return this._http.get(`/sa-services/sa/sast/id/${saId}/projectName/${projectName}/scan/${Id}`)
      // .delay(this.delayMs)
      .map(response => response.text().length > 0 ? response.json() : null, error => <any>error);
    }
    getCSDetails(saId: number) {
      return this._http.get(`/sa-services/sa/sast/projects/id/${saId}`)
      // .delay(this.delayMs)
    }
    genCSReport(saId: number) {
      return this._http.get(`/sa-services/sa/sast/records/create/id/${saId}`)
      // .delay(this.delayMs)
      .map(response => response.text().length > 0 ? response.json() : null, error => <any>error);
    }
    dwnlCSReport(saId: number) {
      return this._http.get(`/sa-services/sa/sast/records/get/id/${saId}`)
      // .delay(this.delayMs)
      .map(response => response.text().length > 0 ? response.json() : null);
    }
    getGraphDetail(scanId: number) {
      return this._http.get(`/sa-services/sa/sast/graph/scan/${scanId}`)
      .map(response => response.text().length > 0 ? response.json() : null);
  }
  getCodeScanProjects() {
      return this._http.get(`/sa-services/sa/sast/projects/addProject`)
      .map(response => response.text().length > 0 ? response.json() : null);
  }
  removeProject(projectId: number) {
    return this._http.delete(`/sa-services/sa/sast/projects/id/${projectId}`)
      .map(response => response.text().length > 0 ? response.json() : null);
  }
}
