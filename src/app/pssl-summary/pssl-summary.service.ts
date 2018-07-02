import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import 'rxjs/add/operator/delay';
import { HttpClient } from './../shared/http.client';
@Injectable()
export class PSSLSummaryService {
  constructor(private _http: HttpClient) {}
  getPSSLSummary(psslData) {
    return this._http.get(
      `/sa-services/sa/assessments/${psslData.id}/summary`)
    .map(response => response.text().length > 0 ? response.json() : null);
  }
  getPenTestWorkStatus(id, feature?: string) {
      return this._http.get(
          `/sa-services/${id}/pentest/${feature ? feature : ''}`)
      .map(response => response.text().length > 0 ? response.json() : null);
  }
}
