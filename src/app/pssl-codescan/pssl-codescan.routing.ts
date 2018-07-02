/**
 * Created by sangkuma on 6/7/17.
 */

import {ModuleWithProviders} from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import {PSSLCodeScanComponent} from "./pssl-codescan.component";

export const pSSLCodeScanRoutes: Routes = [
    {
        path: '',
        component: PSSLCodeScanComponent,
        data: {title: 'Security Assessment - Code Scanning'}
    }
];

export const PSSLCodeScanRouting = RouterModule.forChild(pSSLCodeScanRoutes);
