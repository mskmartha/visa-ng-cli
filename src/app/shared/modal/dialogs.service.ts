import { Observable } from 'rxjs/Rx';
import { CommonDialogComponent } from './dialog.component';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
export class DialogsService {

    constructor(private dialog: MatDialog) { }

    public openDialog(title: string, message: string, modalConfig: ModalConfigData): Observable<boolean> {
        const dialogRef = this.dialog.open(CommonDialogComponent, {
          disableClose: false,
          hasBackdrop: true,
          backdropClass: '',
          width: modalConfig.width ? modalConfig.width : '820px', // default
          height: modalConfig.height ? modalConfig.height : '',
          position: {
            top: '',
            bottom: '',
            left: '',
            right: ''
          },
          data: modalConfig.data ? modalConfig.data : {},
        });
        dialogRef.disableClose = true;
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;
        return dialogRef.afterClosed();
    }
}


export interface ModalConfigData {
    disableClose: boolean;
    width: string;
    height: string;
    data: Data;
}

export interface Data {
    message: string;
    showCancelBttn: boolean;
    showTitle: boolean;
    dynComps: DynComps[];
}
export interface DynComps {
    data: DynCompsData;
    compName: string;
}
export interface DynCompsData {
      id: number;
      currentStatus: number;
      applicationId: string;
      actionId: number;
      isViewDisabled: boolean;
      formId: string;
}
