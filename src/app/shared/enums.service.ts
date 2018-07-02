/**
 * Created by smartha on 5/15/17.
 */
import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';
import 'rxjs/Rx';
import { HttpClient } from './http.client';

@Injectable()
export class EnumsService {
    constructor(private _http: HttpClient) {}
    loadEnums() {
      return this._http.get(`/sa-services/common/globalenums`)
        .map(response => response.text().length > 0 ? response.json() : null);
    }
    getDepartments() {
        return this._http.get(`/config-services/departments`)
        .map(response => response.text().length > 0 ? response.json() : null);
    }
    getUsers() {
        return this._http.get('/config-services/users/')
        .map(response => response.text().length > 0 ? response.json() : null);
    }
}
