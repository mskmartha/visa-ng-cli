/**
 * Created by sangkuma on 5/15/17.
 */
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { GlobalSharedService } from '../shared/shared.service';
import 'rxjs/Rx';
import { HttpClient } from '../shared/http.client';

@Injectable()
export class CSAService {
    constructor(private _http: HttpClient) {
    }
    getCSADetails() {
        return this._http.get(
            `/cs-services/cloud-sec-assessments`)
            .map(response => response.text().length > 0 ? response.json() : null);
    }

    getCSAActions(id, camrId, kccType) {
        return this._http.get(
            `/cs-services/${id}/actions`)
            .map(response => response.text().length > 0 ? response.json() : null);
    }

    camrs() {
        return this._http.get('/cs-services/camrs').map(response => response.text().length > 0 ? response.json() : null);
    }

    questionnaire(id: number, camr: string) {
        return this._http.get(`/cs-services/questionnaire?camrId=${camr}`)
        .map(response => response.text().length > 0 ? response.json() : null);
    }

    viewCSA(id: number, camr: string) {
        return this._http.get(`/cs-services/${id}?actionId=1`)
        .map(response => response.text().length > 0 ? response.json() : null);
    }

    post(action: number, camr?: boolean, body?: any) {
        return this._http.post(`/cs-services/questionnaire`, body)
        .map(res => res.text().length > 0 ? res.json() : null, error => <any>error);
    }

    patch(id: number, action: number, camr?: boolean, body?: any) {
        return this._http.patch(`/cs-services/questionnaire/${id}`, body)
        .map(res => res.text().length > 0 ? res.json() : null, error => <any>error);
    }

    getCSASummary(id: number) {
        return this._http.get(`/cs-services/${id}`)
        .map(response => response.text().length > 0 ? response.json() : null);
    }

    manageCSA(id) {
        return this._http.get(`/cs-services/manage-csa/id/${id}`)
        .map(response => response.text().length > 0 ? response.json() : null);
    }

    updateCSAstatus(id: number, lifeCycleId: number, teamId: string) {
        return this._http.patch(
            `/cs-services/manage-csa/id/${id}/teams/${teamId}/action/${lifeCycleId}`, '')
            .map(response => response.text().length > 0 ? response.json() : null);
    }

    updateTeamstatus(id: number, lifeCycleId: number, teamId: string, stateId: number) {
        return this._http.patch(
            `/cs-services/${id}/teams/${teamId}`, {stateId: stateId})
            .map(response => response.text().length > 0 ? response.json() : null);
    }
    getComments(id: number, teamId: string) {
        return this._http.get(`/cs-services/${id}/comments?teamId=${teamId}`)
        .map(response => response.text().length > 0 ? response.json() : null);
    }
}
