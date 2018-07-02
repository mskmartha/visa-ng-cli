import { DialogsService } from './dialogs.service';
import { MatDialogModule, MatButtonModule  } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonDialogComponent } from './dialog.component';

@NgModule({
    imports: [
        MatDialogModule,
        MatButtonModule,
    ],
    exports: [
        CommonDialogComponent,
    ],
    declarations: [
        CommonDialogComponent,
    ],
    providers: [
        DialogsService,
    ],
    entryComponents: [
        CommonDialogComponent,
    ],
})
export class DialogsModule { }
