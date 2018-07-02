import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { KCCComponent } from './kcc.component';
import { KCCRoutingModule } from './kcc-routing.module';
import { PopoverModule } from 'ng2-bootstrap/popover';
import { ModalModule } from 'ng2-bootstrap/modal';
import { GlobalSharedService } from '../shared/shared.service';
import { KCCDetailsComponent } from './kcc-details.component';
import { KCCSummaryComponent } from './kcc-summary/kcc-summary.component';
import {KccManageDynComponent} from './kcc-summary/kcc-manage-dyn.component';
import {CustomMaterialModule} from '../material-module/material.module';
@NgModule({
    declarations: [KCCComponent, KCCDetailsComponent, KCCSummaryComponent, KccManageDynComponent],
    imports: [
        SharedModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        KCCRoutingModule,
        CustomMaterialModule,
    ],
    providers: [GlobalSharedService],
    entryComponents: [],
    bootstrap: [KCCComponent]
})
export class KCCModule { }
