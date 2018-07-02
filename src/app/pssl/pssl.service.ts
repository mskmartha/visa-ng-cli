import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { HttpClient } from '../shared/http.client';
import 'rxjs/add/operator/delay';
@Injectable()
export class PSSLService {
    constructor(private _http: HttpClient) {
    }
    getPSSLDetails(filter?) {
      if(filter) {
        return this._http.get(`/sa-services/sa/assessments?filter=${filter}`);
      }
      return this._http.get(`/sa-services/sa/assessments`);
    }

    getMoreDetails(psslData) {
        return this._http.get(
            `/sa-services/sa/assessments/${psslData.id}/summary`)
          .map(response => response.text().length > 0 ? response.json() : null);
    }


    getSAActions(id, applicationId) {
      return this._http.get(
            `/sa-services/sa/assessments/${id}/actions`)
            .map(response => response.text().length > 0 ? response.json() : null);
    }

    camrs() {
        return this._http.get('/config-services/camrs').map(response => response.text().length > 0 ? response.json() : null);
    }

    questionnaire(saType: string, id: number, applicationIds: Array<any>, actionId?: number) {
      if(actionId) {
        return this._http.get(`/sa-services/sa/assessments/${id}/actions/${actionId}`)
          .map(response => response.text().length > 0 ? response.json() : null);
      }
      return this._http.get(`/sa-services/common/metadata/${saType}?applicationIds=${applicationIds}`)
        .map(response => response.text().length > 0 ? response.json() : null);
    }

    post(body?: any) {
      return this._http.post(`/sa-services/sa/assessments`, body)
        .map(res => res.text().length > 0 ? res.json() : null, error => <any>error);
    }

    postSAScoping(actionId: number, saId: string, body?: any) {
      return this._http.post(`/sa-services/sa/assessments/${saId}/actions/${actionId}`, body)
        .map(res => res.text().length > 0 ? res.json() : null, error => <any>error);
    }

    postSATriage(actionId: number, saId: string, body?: any) {
      return this._http.post(`/sa-services/sa/assessments/${saId}/actions/${actionId}`, body)
        .map(res => res.text().length > 0 ? res.json() : null, error => <any>error);
    }
    actionsOnSA(saId: number, applicationId: number, action: number) {
        return this._http.patch(`/sa-services/sa/Id/${saId}/applicationId/${applicationId}/action/${action}`, '')
        .map(response => response.text().length > 0 ? response.json() : null);
    }
    updatePSSLstatus(id: number, applicationId: string, actionId: number, psslType: string) {
      const data = {
        "applicationId": applicationId,
        "saId": id,
        "actionId": actionId
      };
        return this._http.patch(`/sa-services/sa/assessments/${id}/actions/${actionId}`, data)
        .map(response => response.text().length > 0 ? response.json() : null);
    }
}
