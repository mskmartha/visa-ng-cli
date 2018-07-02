import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CSASummaryRouting } from './csa-summary.routing';
import { CSASummaryComponent } from './csa-summary.component';
import { ModalModule } from 'ng2-bootstrap/modal';
import { PopoverModule } from 'ng2-bootstrap/popover';
import {CSAService} from '../csa.service';
@NgModule({
    declarations: [
        CSASummaryComponent
    ],
    /*
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    */
    imports: [
        SharedModule,
        CommonModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        CSASummaryRouting
    ],
    providers: [CSAService],
    entryComponents: [],
    bootstrap: [CSASummaryComponent]
})
export class CSASummaryModule { }
