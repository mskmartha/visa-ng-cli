import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { GlobalSharedService } from '../shared/shared.service';
import { EnumsService } from '../shared/enums.service';
import { UtilsService } from '../shared/utils.service';
import {CustomMaterialModule} from '../material-module/material.module';
@NgModule({
    declarations: [DashboardComponent],
    imports: [
        SharedModule,
        CustomMaterialModule,
        RouterModule.forChild([
            {
                path: '',
                component: DashboardComponent,
                data: {
                    title: 'Dashboard'
                },
            }
        ])
    ],
    providers: [GlobalSharedService, EnumsService, UtilsService],

    bootstrap: [DashboardComponent]
})
export class DashboardModule { }
