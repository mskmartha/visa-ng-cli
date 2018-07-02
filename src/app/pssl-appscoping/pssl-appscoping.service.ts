import { HttpClient } from '../shared/http.client';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import 'rxjs/add/operator/delay';

@Injectable()
export class AppScopingService {
  constructor(private _http: HttpClient) {

  }
  appscopingdetails(psslData) {
      return this._http.get(
        `/sa-services/sa/appscopingdetails/id/${psslData.id}/applicationId/${psslData.applicationId}`);
  }
  getFeaturesJira(options?: any) {
    // optional query param: &forceSync=${options.forceSync}
    return this._http.get(
      `/sa-services/sa/appscopingdetails/id/${options.id}/applicationId/${options.applicationId}?jiraId=${options.jiraId}`)
      .map(res => res.text().length > 0 ? res.json() : null, error => <any>error);
  }
  forceFeaturesJira(options?: any) {
    // optional query param: &forceSync=${options.forceSync}
    return this._http.get(
      `/sa-services/sa/appscopingdetails/id/${options.id}/applicationId/${options.applicationId}?forceSync=${options.forceSync}`);
  }
  completeAppscoping(body?: any, options?: any) {
    return this._http.post(
      `/sa-services/sa/appscopingdetails/id/${options.id}/applicationId/${options.applicationId}/action/${options.action}`, body)
    .map(res => res.text().length > 0 ? res.json() : null, error => <any>error);
  }
}
