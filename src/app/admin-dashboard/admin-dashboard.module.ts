import {NgModule} from '@angular/core';
import {AdminDashboardComponent} from './admin-dashboard.component';
import {CommonModule} from '@angular/common';
import {AdminDashboardRouting} from './admin-dashboard-routing.module';
import {CustomMaterialModule} from '../material-module/material.module';
import {ChartsModule} from 'ng2-charts';
import {SharedModule} from '../shared/shared.module';
import {AdminApiService} from './admin-api.service';
import {UtilsService} from '../shared/utils.service';

@NgModule({
  declarations: [
    AdminDashboardComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminDashboardRouting,
    CustomMaterialModule,
    ChartsModule
  ],
  exports: [
  ],
  providers: [AdminApiService, UtilsService],
  entryComponents: [],
  bootstrap: [AdminDashboardComponent]
})
export class AdminDashboardModule {}
