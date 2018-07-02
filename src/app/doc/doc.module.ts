import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { SharedModule } from '../shared/shared.module'
import { DocComponent } from './doc.component';


@NgModule({
    declarations: [DocComponent],
    imports: [
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: DocComponent,
                data: {
                    title: 'Documentation'
                },
            }
        ])
    ],
    providers: [],

    bootstrap: [DocComponent]
})
export class DocModule { }
