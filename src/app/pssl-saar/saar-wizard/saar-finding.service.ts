/**
 * Created by smartha on 5/15/17.
 */
import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';
import { HttpClient } from './../../shared/http.client';
import 'rxjs/Rx';
@Injectable()
export class SAARFindingsService {
    constructor(private _http: HttpClient) {}
    submitFindings(body?: any, SADetails?: any) {
      return this._http.post(
        `/sa-services/sa/saarvulnerabilities/updatevulnerabilities?id=${SADetails.id}&applicationId=${SADetails.applicationId}`, body)
      .map(res => res.text().length > 0 ? res.json() : null, error => <any>error);
    }
    getThreatCategory(tc) {
      return this._http.get(
        `/sa-services/sa/saarmapping/category?threatCategory=${tc}`)
        .map(response => response.text().length > 0 ? response.json() : null);
    }

    getVulnerabilityDtls(vid) {
      return this._http.get(`/sa-services/sa/saarmapping/vulnerability?vid=${vid}`)
      .map(response => response.text().length > 0 ? response.json() : null);
    }

    loadEnums() {
      return this._http.get(`/sa-services/common/globalenums`)
      .map(response => response.text().length > 0 ? response.json() : null);
    }
}
