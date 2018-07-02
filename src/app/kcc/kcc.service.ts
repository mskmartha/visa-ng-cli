/**
 * Created by sangkuma on 5/15/17.
 */
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { GlobalSharedService } from '../shared/shared.service';
import 'rxjs/Rx';
import { HttpClient } from '../shared/http.client';
import 'rxjs/add/operator/delay';
@Injectable()
export class KCCService {
    delayMs = 10000; // use for unit test only
    constructor(private _http: HttpClient) {
    }
    getKCCDetails() {
        return this._http.get(
          `/sa-services/kcc/kcclist`)
          .map(response => response.text().length > 0 ? response.json() : null);
    }
    getKCCActions(id, camrId, kccType) {
        return this._http.get(
            `/sa-services/common/${kccType}/${id}/actions`)
            .map(response => response.text().length > 0 ? response.json() : null);
    }
    updateKCCstatus(id: number, lifeCycleId: number, kccType: string) {
        return this._http.patch(
          `/sa-services/kcc/${id}/action/${lifeCycleId}?kccType=${kccType}`, '')
          .map(response => response.text().length > 0 ? response.json() : null);
    }
    questionnaire(id: number, pmm: boolean) {
        return this._http.get(`/sa-services/kcc/questionnaire?id=${id}&isPMM=${pmm}`)
        .map(response => response.text().length > 0 ? response.json() : null);
    }

    post(action: number, pmm?: boolean, body?: any) {
        return this._http
        .post(`/sa-services/kcc/questionnaire?isPMM=${pmm}&actionId=${action}`, body)
        .map(res => res.text().length > 0 ? res.json() : null, error => <any>error);
    }

    postPprPir(kccType: string, action: number, body?: any) {
      return this._http
      .post(`/sa-services/kcc/questionnaire/${kccType}?actionId=${action}`, body)
      .map(res => res.text().length > 0 ? res.json() : null, error => <any>error);
    }

    getPIRPPRQns(id: number, kccType: string) {
        return this._http.get(`/sa-services/kcc/questionnaire/${id}/${kccType}`)
        // .delay(this.delayMs);
    }

    getKCCSummary(id: number, kccType: string) {
        return this._http.get(`/sa-services/kcc/${id}/kccsummary/kcctype/${kccType}`);
    }
}