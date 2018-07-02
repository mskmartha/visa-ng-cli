import { FormGroup } from '@angular/forms';

import { TableDataSource } from './table-data-source';
export class TableElement<T> {
  id: number;
  editing: boolean;
  currentData?: T;
  originalData: T;
  source: TableDataSource<T>;
  validator: FormGroup;
  name: string;
  constructor(init: Partial<TableElement<T>>) {
    Object.assign(this, init);
  }

  delete(): void {
    this.source.delete(this);
  }

  startEdit(): void {
    this.originalData = this.currentData;
    this.editing = true;
    this.validator.enable();
  }
}
