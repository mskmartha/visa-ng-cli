import { Injectable } from '@angular/core';
import {HttpClient} from '../shared/http.client';

@Injectable()
export class AdminApiService {

  constructor(private _http: HttpClient) { }
  getAssessments(filter?) {
    if(filter) {
      return this._http.get(`/sa-services/sa/assessments?filter=${filter}`)
        .map(response => response.text().length > 0 ? response.json() : null);
    }
    return this._http.get(`/sa-services/sa/assessments`)
      .map(response => response.text().length > 0 ? response.json() : null);
  }

  getMoreDetails(id) {
    return this._http.get(
      `/sa-services/sa/assessments/${id}/summary`)
      .map(response => response.text().length > 0 ? response.json() : null);
  }
  getEngagementSummary() {
    return this._http.get(
      `/sa-services/sa/assessments/summary`)
      .map(response => response.text().length > 0 ? response.json() : null);
  }
}
