import {RouterModule, Routes} from '@angular/router';
import {AdminDashboardComponent} from './admin-dashboard.component';
import {AuthGuard} from '../auth/auth.guard';

export const AdminDashboardRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: AdminDashboardComponent,
    data: {
      title: 'Admin Dashboard'
    },
    children: [

    ]
  }
];

export const AdminDashboardRouting = RouterModule.forChild(AdminDashboardRoutes);
