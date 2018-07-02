import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditableTableComponent } from './editable-table.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    EditableTableComponent
  ],
  providers: [],
  exports: [EditableTableComponent],
})
export class EditableTableModule { }
