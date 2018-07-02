/**
 * Created by smartha on 5/15/17.
 */
import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';
import 'rxjs/Rx';
import { HttpClient } from '../../shared/http.client';

@Injectable()
export class LLDRFindingsService {
    constructor(private _http: HttpClient) {}
    submitFindings(body?: any, SADetails?: any) {
      return this._http.post(
        `/sa-services/sa/ldrfindings/updateldrfindings?id=${SADetails.id}&applicationId=${SADetails.applicationId}`, body)
      .map(res => res.text().length > 0 ? res.json() : null, error => <any>error);
    }
    loadEnums() {
        return this._http.get(`/sa-services/common/globalenums`)
        .map(response => response.text().length > 0 ? response.json() : null);
    }
}
