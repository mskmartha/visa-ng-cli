import {Component, OnInit, Renderer, ElementRef, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import { UploadFileService } from '../upload-file.service';
import {MatSnackBar} from '@angular/material';
import {SnackBarErrorComponent, SnackBarSuccessComponent} from '../../html-templates/snack-bar.component';
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  @Input() uploadOptions: any;
  @Output() emitCurrentStepEvent = new EventEmitter();

  selectedFiles: FileList;
  currentFileUpload: File;

  constructor(private uploadService: UploadFileService, private renderer: Renderer, public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  selectFile(event) {
    console.log(event.target.files)
    this.selectedFiles = event.target.files;
  }
  showFileBrowseDlg(event) {
    const disEvent: MouseEvent = new MouseEvent('click', {bubbles: true});
    this.renderer.invokeElementMethod(this.fileInput.nativeElement, 'dispatchEvent', [disEvent]);
    this.renderer.listen(this.fileInput.nativeElement, 'change', ( ev ) => this.selectFile(ev))
  }
  upload() {
    this.currentFileUpload = this.selectedFiles.item(0)
    this.uploadService.pushFileToStorage(this.uploadOptions.endPoint, this.currentFileUpload).subscribe(event => {
      this.snackBar.openFromComponent(SnackBarSuccessComponent, {
        duration: 2000,
      });
      this.selectedFiles = undefined
      this.emitCurrentStepEvent.next();
    }, err => {
      this.snackBar.openFromComponent(SnackBarErrorComponent, {
        duration: 2000,
        data: (err.status === 401) ? 'Not Authorized' : null
      });
    })
  }
  clearSelection() {
    this.selectedFiles = undefined
  }
}
