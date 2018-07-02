import {Component, Input, OnInit} from '@angular/core';
import {HttpClient, HttpEventType, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {UploadFileService} from '../upload-file.service';
import {saveAs as importedSaveAs} from 'file-saver';
@Component({
  selector: 'app-file-download',
  template: `<button mat-raised-button class="cta-1" (click)='downloadFiles(true)'>Download Report</button>`,
})
export class FileDownloadComponent implements OnInit {
  fileUploads: Observable<string[]>
  @Input() uploadOptions: any;
  constructor(private uploadService: UploadFileService) {}

  ngOnInit() {
  }

  downloadFiles() {
    this.uploadService.downloadFile(this.uploadOptions.endPoint).subscribe(blob => {
        // importedSaveAs(blob, this.fileName);
        // importedSaveAs(blob, 'xyz');
      }
    )
  }
}
