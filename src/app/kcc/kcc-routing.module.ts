import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KCCComponent } from './kcc.component';
import { KCCDetailsComponent } from './kcc-details.component';
import { KCCSummaryComponent } from './kcc-summary/kcc-summary.component';
const routes: Routes = [
  { path: '',
    component: KCCComponent,
    data: {
        title: 'Key Controls Checklist'
    },
    children: [
        {
            path: '',
            data: {
                title: 'Details'
            },
            component: KCCDetailsComponent,
        },
        {
            path: 'manage',
            data: {
                title: 'Manage'
            },
            component: KCCSummaryComponent,
        }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KCCRoutingModule { }