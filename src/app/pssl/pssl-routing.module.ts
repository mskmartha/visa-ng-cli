import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PSSLComponent } from './pssl.component';
import { PSSLDetailsComponent } from './pssl-details.component';
import { PSSLService } from './pssl.service';
const routes: Routes = [
  {
    path: 'admin-dashboard',
    data: {
      title: 'Admin-dashboard'
    },
    loadChildren: '../admin-dashboard/admin-dashboard.module#AdminDashboardModule',
  },
  { path: '',
    component: PSSLComponent,
    data: {
        title: 'Security Assessment'
    },
    children: [
        {
          path: '',
          data: {
            title: 'Details'
          },
          component: PSSLDetailsComponent,
        },
        {
            path: ':saId',
            data: {
                title: 'Details'
            },
            redirectTo: ':saId/manage',
            loadChildren: '../pssl-summary/pssl-summary.module#PSSLSummaryModule'
        },
        {
            path: ':saId/manage',
            data: {
                title: 'Manage'
            },
            loadChildren: '../pssl-summary/pssl-summary.module#PSSLSummaryModule'
        }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PSSLRoutingModule { }
