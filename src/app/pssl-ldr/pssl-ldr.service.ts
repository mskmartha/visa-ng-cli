import { HttpClient } from './../shared/http.client';
/**
 * Created by smartha on 6/14/17.
 */
import { Component, Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/Rx';

@Injectable()
export class LLDRService {
    public params: any;
    constructor(private _routeParams: ActivatedRoute, private _http: HttpClient) {
        this._routeParams.params.subscribe(params => {
            this.params = params;
        });
    }
    getLLDRDetails(psslData) {
      return this._http.get(
        `/sa-services/sa/ldrfindings?id=${psslData.id}&applicationId=${psslData.applicationId}`)
    }

    getFinding(id, applicationId, findingId) {
      return this._http.get(
        `/sa-services/sa/ldrfindings?id=${id}&applicationId=${applicationId}&findingId=${findingId}`)
        .map(response => response.text().length > 0 ? response.json() : null);
    }
}
