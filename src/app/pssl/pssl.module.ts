import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PSSLComponent } from './pssl.component';
import { PSSLRoutingModule } from './pssl-routing.module';
import { PSSLDetailsComponent } from './pssl-details.component';
import { PopoverModule } from 'ng2-bootstrap/popover';
import { ModalModule } from 'ng2-bootstrap/modal';
import { GlobalSharedService } from '../shared/shared.service';
import {ShowAllCamrsComponent} from './showAllCamrs.component';
import {CustomMaterialModule} from '../material-module/material.module';
import {AngularDraggableModule} from 'angular2-draggable';
import {AdminDashboardModule} from '../admin-dashboard/admin-dashboard.module';

@NgModule({
    declarations: [
        PSSLComponent,
        PSSLDetailsComponent,
        ShowAllCamrsComponent
    ],
    imports: [
        SharedModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        PSSLRoutingModule,
        CustomMaterialModule,
        AngularDraggableModule,
      AdminDashboardModule
    ],
  exports: [
    PSSLComponent
  ],
    providers: [GlobalSharedService],
    entryComponents: [ShowAllCamrsComponent],
    bootstrap: [PSSLComponent]
})
export class PSSLModule { }
