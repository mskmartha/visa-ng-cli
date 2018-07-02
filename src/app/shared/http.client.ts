import { UserInfoService } from './../userinfo.service';
import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, ResponseContentType} from '@angular/http';
import { AuthConfigConsts, JwtHelper } from 'angular2-jwt';

import { environment } from './../../environments/environment';

@Injectable()
export class HttpClient {

  MS_API_SERVER = environment.MS_API_SERVER;
  MS_API_PROTOCOL = environment.MS_API_PROTOCOL;
  MS_API_PORT = environment.MS_API_PORT;
  private userName = '';

  constructor(private http: Http, private jwtHelper: JwtHelper, private _userInfoService: UserInfoService) {}

  setAuthorizationHeader(headers: Headers) {
    const slToken = sessionStorage.getItem('slToken');
    if ( slToken != null && this.jwtHelper.isTokenExpired(slToken)) {
      sessionStorage.removeItem('slToken');
      this._userInfoService.getUserDetails().subscribe((res) => {
      this.userName = res.user.split('\\')[1];
      sessionStorage.setItem('currentUser', JSON.stringify({ loggedIn: true, userName: this.userName }));
      sessionStorage.setItem('slToken', res.token);
      });
    }
    headers.append(AuthConfigConsts.DEFAULT_HEADER_NAME, AuthConfigConsts.HEADER_PREFIX_BEARER +
      sessionStorage.getItem('slToken'));
  }

  setContentTypeHeader(headers: Headers) {
    headers.append('Content-Type', 'application/json');
  }

  setAcceptHeader(headers: Headers) {
    headers.append('Accept', 'application/json');
  }

  get(url) {
    const headers = new Headers();
    this.setAuthorizationHeader(headers);
    this.setContentTypeHeader(headers);
    return this.http.get(`${this.MS_API_PROTOCOL}://${this.MS_API_SERVER}:${this.MS_API_PORT}${url}`, {
      headers: headers
    });
  }

  getWithReqOptions(url, requestOptions: RequestOptions) {
    const headers = new Headers();
    this.setAuthorizationHeader(headers);
    this.setContentTypeHeader(headers);
    requestOptions.headers = headers;
    return this.http.get(
      `${this.MS_API_PROTOCOL}://${this.MS_API_SERVER}:${this.MS_API_PORT}${url}`, requestOptions);
  }

  post(url, data) {
    const headers = new Headers();
    this.setAuthorizationHeader(headers);
    this.setContentTypeHeader(headers);
    this.setAcceptHeader(headers);
    return this.http.post(`${this.MS_API_PROTOCOL}://${this.MS_API_SERVER}:${this.MS_API_PORT}${url}`, data, {
      headers: headers
    });
  }

  upload(url, data) {
    const headers = new Headers();
    //headers.append('Content-Type', 'multipart/form-data');
    //headers.append('Accept', 'application/json');
    //headers.append('Accept', 'text/plain');
    //headers.append('Accept', '*/*');
    ///headers.append('Accept', 'application/x-www-form-urlencoded');

    this.setAuthorizationHeader(headers);

    return this.http.post(`${this.MS_API_PROTOCOL}://${this.MS_API_SERVER}:${this.MS_API_PORT}${url}`, data, {
      headers: headers,
      responseType: ResponseContentType.ArrayBuffer
    })
  }

  download(url, data) {
    const headers = new Headers();
    headers.delete('Accept');
    this.setAuthorizationHeader(headers);
    //this.setContentTypeHeader(headers);
    let options = new RequestOptions({headers: headers, responseType: ResponseContentType.Blob });
    return this.http.get(`${this.MS_API_PROTOCOL}://${this.MS_API_SERVER}:${this.MS_API_PORT}${url}`, options);
  }

  put(url, data) {
    const headers = new Headers();
    this.setAuthorizationHeader(headers);
    this.setContentTypeHeader(headers);
    this.setAcceptHeader(headers);
    return this.http.put(`${this.MS_API_PROTOCOL}://${this.MS_API_SERVER}:${this.MS_API_PORT}${url}`, data, {
      headers: headers
    });
  }

  patch(url, data) {
    const headers = new Headers();
    this.setAuthorizationHeader(headers);
    this.setContentTypeHeader(headers);
    return this.http.patch(`${this.MS_API_PROTOCOL}://${this.MS_API_SERVER}:${this.MS_API_PORT}${url}`, data, {
      headers: headers
    });
  }

  delete(url) {
    const headers = new Headers();
    this.setAuthorizationHeader(headers);
    this.setContentTypeHeader(headers);
    return this.http.delete(`${this.MS_API_PROTOCOL}://${this.MS_API_SERVER}:${this.MS_API_PORT}${url}`, {
      headers: headers
    });
  }
}
