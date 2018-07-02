import {ModuleWithProviders} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CSASummaryComponent} from './csa-summary.component';

export const cSASummaryRoutes: Routes = [
  {
    path: '',
    component: CSASummaryComponent,
    data: {
      title: 'CSA Summary'
    },
    children: [
    ]
  }
];

export const CSASummaryRouting = RouterModule.forChild(cSASummaryRoutes);
