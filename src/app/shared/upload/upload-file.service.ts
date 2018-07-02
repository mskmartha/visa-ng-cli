import {Injectable} from '@angular/core';

import { HttpClient } from '../../shared/http.client';
import {ResponseContentType, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {saveAs as importedSaveAs} from 'file-saver';

@Injectable()
export class UploadFileService {

  constructor(private http: HttpClient) {}

  pushFileToStorage(url, file: File): Observable<any> {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    return this.http.upload(url, formdata);
  }

  downloadFile(url): Observable<void> {
    const options = new RequestOptions({responseType: ResponseContentType.Blob });
    return this.http.download(url, options)
      .map(res => this.saveToFileSystem(res))
      // .catch(this.handleError)
  }

  private saveToFileSystem(response) {
    const contentDispositionHeader: string = response.headers.get('Content-Disposition');
    const parts: string[] = contentDispositionHeader.split(';');
    const filename = parts[1].split('=')[1];
    const blob = new Blob([response._body], { type: 'text/plain' });
    importedSaveAs(blob, filename);
  }
}
