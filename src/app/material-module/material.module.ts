import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CdkTableModule} from '@angular/cdk/table';
import {OverlayModule} from '@angular/cdk/overlay';
import {
  MatAutocompleteModule,
  MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatFormFieldModule, MatIconModule,
  MatMenuModule,
  MatProgressSpinnerModule, MatRadioModule, MatSelectModule, MatTabsModule, MatTooltipModule, MatCardModule,
  MatSnackBarModule, MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatSlideToggleModule,
  MatSidenavModule, MatNativeDateModule, MatToolbarModule, MatListModule, MatGridListModule, MatButtonModule,
  MatChipsModule, MatStepperModule
} from '@angular/material';
import {MatMomentDateModule} from '@angular/material-moment-adapter';

@NgModule({
  exports: [
    CommonModule,
    // CDk
    CdkTableModule,
    OverlayModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatMenuModule,
    MatDialogModule,
    MatCardModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatChipsModule,
    MatMomentDateModule,
    MatStepperModule
  ],
  declarations: [],
})
export class CustomMaterialModule { }
