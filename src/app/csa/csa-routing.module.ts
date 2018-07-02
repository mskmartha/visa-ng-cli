import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CSAComponent } from './csa.component';
import { CSADetailsComponent } from './csa-details.component';
import { CSASummaryComponent } from './csa-summary/csa-summary.component';
const routes: Routes = [
  { path: '',
    component: CSAComponent,
    data: {
        title: 'Cloud Security Management'
    },
    children: [
        {
            path: '',
            data: {
                title: 'Details'
            },
            component: CSADetailsComponent,
        },
        {
            path: 'manage',
            data: {
                title: 'Manage'
            },
            component: CSASummaryComponent,
        }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CSARoutingModule { }