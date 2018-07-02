/**
 * Created by smartha on 6/7/17.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import {PSSLCodeScanRouting} from './pssl-codescan.routing';
import { PSSLCodeScanComponent } from './pssl-codescan.component';
import { ModalModule } from 'ng2-bootstrap/modal';
import { PopoverModule } from 'ng2-bootstrap/popover';
import { PSSLCsWizardComponent } from './codescan-wizard/csWizard.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import { PSSLCsGraphWizardComponent } from './codescan-graph/csGraphWizard.component';
import {CustomMaterialModule} from '../material-module/material.module';

@NgModule({
    declarations: [PSSLCodeScanComponent, PSSLCsWizardComponent, PSSLCsGraphWizardComponent],
    imports: [
        SharedModule,
        PSSLCodeScanRouting,
        CommonModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        FormsModule,
        CustomMaterialModule,
        ReactiveFormsModule,
    ],
    providers: [],
    entryComponents: [PSSLCsWizardComponent, PSSLCsGraphWizardComponent],
    bootstrap: [PSSLCodeScanComponent]
})
export class PSSLCodeScanModule { }
