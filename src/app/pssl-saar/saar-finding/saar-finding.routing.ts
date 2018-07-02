/**
 * Created by sangkuma on 7/1/17.
 */
import { Routes, RouterModule } from '@angular/router';
import { SaarFindingComponent } from './saar-finding.component';

export const saarFindingRoutes: Routes = [
  {
    path: '',
    component: SaarFindingComponent,
    data: {title: 'Security Assessment - SAAR Finding'}
  }
];

export const SaarFindingRouting = RouterModule.forChild(saarFindingRoutes);