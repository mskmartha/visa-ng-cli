import { Injectable } from '@angular/core';
import { HttpClient } from '../http.client';
import { IComment } from './chat.component';
import { Subject, Observable } from 'rxjs/Rx';
import { Response } from '@angular/http';

@Injectable()
export class ChatComponentService {
  url = '';
  comments: IComment[] = [];
  constructor(private _httpClient: HttpClient) {}

  getComments(type: string, id: number, user: string): Observable<IComment[]> {
    if (type === 'kccMain') {
      this.url = `/sa-services/kcc/${id}/comments?userName=${user}`;
    }
    return this._httpClient.get(this.url).map((response: Response) => {
      return <IComment[]> response.json();
    });
  }

  postMessage(type: string, id: number, group: string, user: string, message: string, teamId): Observable<any> {
    // KCC
    if (type === 'kccMain') {
      this.url = `/sa-services/kcc/${id}/comments?userName=${user}`;
    } else if (type === 'KCCP1') {
      this.url = `/sa-services/kcc/${id}/comments?userName=${user}&kccType=KCCP1&groupId=${group}`;
    } else if (type === 'KCCP2') {
      this.url = `/sa-services/kcc/${id}/comments?userName=${user}&kccType=KCCP2&groupId=${group}`;

    // Cloud
    } else if (type === 'CSA') {
      this.url = `/cs-services/${id}/comments?teamId=${teamId}`;
    }
    return this._httpClient.post(this.url, {comment: message});
  }
}
