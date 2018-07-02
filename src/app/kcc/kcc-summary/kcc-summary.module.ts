import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { KCCSummaryRouting } from './kcc-summary.routing';
import { KCCSummaryComponent } from './kcc-summary.component';
import { ModalModule } from 'ng2-bootstrap/modal';
import { PopoverModule } from 'ng2-bootstrap/popover';
import {KCCService} from '../kcc.service';
import { NoAccessTemplateComponent } from '../../shared/html-templates/no-access';
import {KccManageDynComponent} from './kcc-manage-dyn.component';
@NgModule({
    declarations: [
        KCCSummaryComponent,
        KccManageDynComponent,
        NoAccessTemplateComponent
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
        KCCSummaryRouting
    ],
    providers: [KCCService],
    entryComponents: [],
    bootstrap: [KCCSummaryComponent]
})
export class KCCSummaryModule { }
