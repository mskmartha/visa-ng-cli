/**
 * Created by sangkuma on 5/15/17.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from '../environments/environment';
import 'rxjs/Rx';
@Injectable()
export class UserInfoService {
    ENV = environment.envName;
    NODEJS_SERVER = environment.NODEJS_SERVER;
    NODEJS_PROTOCOL = environment.NODEJS_PROTOCOL;
    NODEJS_PORT = environment.NODEJS_PORT;
    MS_API_PROTOCOL = environment.MS_API_PROTOCOL;
    MS_API_SERVER = environment.MS_API_SERVER;
    MS_API_PORT = environment.MS_API_PORT;
    // ntId = JSON.parse(sessionStorage.getItem('userInfo'));
    constructor(private _http: Http) {
    }
    getUserDetails() {
      return this._http.get(
        `${this.NODEJS_PROTOCOL}://${this.NODEJS_SERVER}:${this.NODEJS_PORT}/getUserInfo`)
        .map(response => { return response.json(); });
    }

    getDetailedUserInfo(ntId: string) {
      return this._http.get(
        `${this.MS_API_PROTOCOL}://${this.MS_API_SERVER}:${this.MS_API_PORT}/config-services/user/${ntId}`)
        .map(response => response.text().length > 0 ? response.json() : null);
    }
}
