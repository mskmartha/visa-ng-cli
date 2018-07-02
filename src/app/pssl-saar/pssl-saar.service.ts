/**
 * Created by smartha on 6/14/17.
 */
import { Component, Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';

import { Router } from '@angular/router';
import 'rxjs/Rx';
import { UserInfoService } from '../userinfo.service';
import { HttpClient } from '../shared/http.client';

@Injectable()
export class SAARService {
  public params: any;
  constructor(private _http: HttpClient) {}
  getSaarDetails(psslData) {
    return this._http.get(
      `/sa-services/sa/saarfinding/findingsummary?applicationId=${psslData.applicationId}&Id=${psslData.id}`);
  }
  getFinding(findingId) {
    return this._http.get(`/sa-services/sa/saarfinding/viewfinding?saarId=${findingId}`)
    .map(response => response.text().length > 0 ? response.json() : null);
  }

  saarquestionnaire(editSaDetails) {
    return this._http.get(
      `/sa-services/sa/saarquestionnaire?applicationId=${editSaDetails.applicationId}&id=${editSaDetails.id}`)
    .map(response => response.text().length > 0 ? response.json() : null);
  }

  saarsummary(psslData) {
    return this._http.get(
      `/sa-services/sa/saarsummary?applicationId=${psslData.applicationId}&id=${psslData.id}`);
  }

  post(body?: any, editSAData?: any, options?: any) {
    return this._http.post(
      `/sa-services/sa/saarquestionnaireresponse?id=${editSAData.id}&applicationId=${editSAData.applicationId}`, body)
      .map(res => res.text().length > 0 ? res.json() : null, error => <any>error);
  }
}
