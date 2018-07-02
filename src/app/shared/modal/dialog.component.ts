import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
import { GlobalSharedService } from '../shared.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
@Component({
    selector: 'app-common-dialog',
    templateUrl: `./dialog.component.html`,
    styleUrls: ['./dialog.component.css'],
})
export class CommonDialogComponent implements OnInit {

    public title: string;
    public message: string;
    public dynCompData;
    private showCancelBttn = true;
    private showTitle = true;
    private  closeEvent = new BehaviorSubject('cancel');
    constructor(
        public dialogRef: MatDialogRef<CommonDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private dialogData: any,
        private sharedService: GlobalSharedService
    ) {
        this.dynCompData = dialogData;
        this.showCancelBttn = this.dynCompData.showCancelBttn;
        this.showTitle = this.dynCompData.showTitle;
        this.sharedService.getData('resizeModal').subscribe( _resizeModal => {
            // this.dialogRef.updateSize('80%', '80%');
        });
    }
    ngOnInit () {
        const top = this.dynCompData.top;
        const left = this.dynCompData.left;
        this.dialogRef.updatePosition({ top: top, left: left });
    }
  closeEventValue(event) {
    this.closeEvent.next(event);
  }
}
