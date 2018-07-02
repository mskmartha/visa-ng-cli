import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CSAComponent } from './csa.component';
import { CSARoutingModule } from './csa-routing.module';
import { PopoverModule } from 'ng2-bootstrap/popover';
import { ModalModule } from 'ng2-bootstrap/modal';
import { GlobalSharedService } from '../shared/shared.service';
import { CSADetailsComponent } from './csa-details.component';
import { CSASummaryComponent } from './csa-summary/csa-summary.component';
import {CustomMaterialModule} from '../material-module/material.module';
@NgModule({
    declarations: [CSAComponent, CSADetailsComponent, CSASummaryComponent],
    imports: [
        SharedModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        CSARoutingModule,
        CustomMaterialModule
    ],
    providers: [GlobalSharedService],
    entryComponents: [],
    bootstrap: [CSAComponent]
})
export class CSAModule { }
