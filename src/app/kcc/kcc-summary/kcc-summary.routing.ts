import {ModuleWithProviders} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {KCCSummaryComponent} from './kcc-summary.component';
import {KCCPprPirComponent} from './kcc-ppr-pir.component';

export const kCCSummaryRoutes: Routes = [
  {
    path: '',
    component: KCCSummaryComponent,
    data: {
      title: 'KCC Summary'
    },
    children: [
    ]
  }
];

export const KCCSummaryRouting = RouterModule.forChild(kCCSummaryRoutes);
