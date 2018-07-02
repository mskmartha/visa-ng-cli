import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { TSRSearchComponent } from './tsr-search/tsr-search.component';

import { TSRWizardComponent } from '../tsr/tsr-wizard/tsr-wizard.component';
import { PopoverModule } from 'ng2-bootstrap/popover';

import { ModalModule } from 'ng2-bootstrap/modal';
import {CdkTableModule} from '@angular/cdk/table';
import {CustomMaterialModule} from '../material-module/material.module';

@NgModule({
    declarations: [TSRSearchComponent, TSRWizardComponent],
    imports: [
        SharedModule,
        CustomMaterialModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        RouterModule.forChild([
            {
                path: '',
                component: TSRSearchComponent,
                data: {
                    title: 'Technical Security Requirements'
                },
            }
        ]),
        CdkTableModule
    ],
    providers: [],
    entryComponents: [TSRWizardComponent],
    bootstrap: [TSRSearchComponent]
})
export class TSRModule { }
