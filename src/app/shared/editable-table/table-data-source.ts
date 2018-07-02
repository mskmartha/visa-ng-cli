import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import {TableElement} from './table-element';
import { HttpClient } from '../http.client';
import { TableValidatorService } from '../form-controls/editable-table-validator.service';
import {FormBuilder} from '@angular/forms';
export class TableDataSource<T> extends DataSource<TableElement<T>> {
  private rowsSubject: BehaviorSubject<TableElement<T>[]>;
  datasourceSubject: Subject<T[]>;
  private dataConstructor: new () => T;
  private dataKeys: any[];
  private currentData: any;
  /**
   * Creates a new TableDataSource instance, that can be used as datasource of `@angular/cdk` data-table.
   * @param data Array containing the initial values for the TableDataSource. If not specified, then `dataType` must be specified.
   * @param dataType Type of data contained by the Table. If not specified, then `data` with at least one element must be specified.
   * @param validatorService Service that create instances of the FormGroup used to validate row fields.
   * @param config Additional configuration for table.
   */
  constructor(
    data: T[],
    private tableConfig: any,
    private _http: HttpClient, // http
    dataType?: new () => T,
    private config = { prependNewElements: false },
    private tableValidatorService?: TableValidatorService,
    private fb?: FormBuilder
    ) {

    super();

    if (!tableValidatorService) {
      this.tableValidatorService = new TableValidatorService(fb);
    }

    if (dataType) {
      this.dataConstructor = dataType;
    } else {
      if (data && data.length > 0) {
        this.dataKeys = Object.keys(data[0]);
      } else {
        throw new Error('You must define either a non empty array, or an associated class to build the table.');
      }
    }
    this.rowsSubject = new BehaviorSubject(this.getRowsFromData(data, tableConfig));
    this.datasourceSubject = new Subject<T[]>();
  }

  /**
   * Start the creation of a new element, pushing an empty-data row in the table.
   */
  createNew(tableConfig: any): void {
    if (tableConfig.disabled){
      return;
    }
    const source = this.rowsSubject.getValue();
    if (!this.existsNewElement(source) && source.length < tableConfig.threshold) {

      const newElement = new TableElement({
        id: -1,
        editing: true,
        currentData: this.createNewObject(),
        source: this,
        validator: this.tableValidatorService.toFormGroup(tableConfig.columns, false),
      });

      newElement.validator.valueChanges.subscribe(control => {
        // console.log('valuechnage',control);
      });


      if (this.config.prependNewElements) {
        this.rowsSubject.next([newElement].concat(source));
      } else {
        source.push(newElement);
        this.rowsSubject.next(source);
      }
    }
  }
  /**
   * Confirm creation of the row. Save changes and disable editing.
   * If validation active and row data is invalid, it doesn't confirm creation neither disable editing.
   * @param row Row to be confirmed.
   */
  confirmCreate(row: TableElement<T>, tableConfig: any): Promise<any> {
    return this._http.patch(tableConfig.endPoint, JSON.stringify(row.validator.value))
      .toPromise()
      .then(res => {
        const source = this.rowsSubject.getValue();
        row.id = source.length - 1;
        this.rowsSubject.next(source);

        row.editing = false;
        row.validator.disable();

        this.updateDatasourceFromRows(source);
        if (row.validator.value.id = undefined) {
          row.validator.value.id = 0;
        };
        return res.text().length > 0 ? res.json() : null, error => <any>error;
      });

  }

  /**
   * Confirm edition of the row. Save changes and disable editing.
   * If validation active and row data is invalid, it doesn't confirm editing neither disable editing.
   * @param row Row to be edited.
   */
  confirmEdit(row: TableElement<T>, tableConfig: any): boolean {
    if (!row.validator.valid) {
      return false;
    }

    this._http.patch(tableConfig.endPoint, JSON.stringify(row.validator.value))
      .map(res => res.text().length > 0 ? res.json() : null, error => <any>error)
      .subscribe(res => {
        const source = this.rowsSubject.getValue();
        const index = this.getIndexFromRowId(row.id, source);
        source[index] = row;
        this.rowsSubject.next(source);
        row.editing = false;
        row.validator.disable();
        this.updateDatasourceFromRows(source);
      }, err => {
      });
    return true;
  }

  /**
   * Delete the row with the index specified.
   */
  delete(row: TableElement<T>, tableConfig?: any): void {
    const source = this.rowsSubject.getValue();
    const index = this.getIndexFromRowId(row.id, source);


    this._http.delete(tableConfig.endPoint + '/' + row.validator.value.id)
      .map(res => res.text().length > 0 ? res.json() : null, error => <any>error)
      .subscribe(res => {
        source.splice(index, 1);
        this.updateRowIds(index, source);
        this.rowsSubject.next(source);
        if (row.id !== -1) {
          this.updateDatasourceFromRows(source);
        }
      }, err => {

      });
  }

  /**
   * Get row from the table.
   * @param id Id of the row to retrieve, -1 returns the current new line.
   */
  getRow(id: number): TableElement<T> {
    const source = this.rowsSubject.getValue();
    const index = this.getIndexFromRowId(id, source);

    return (index >= 0 && index < source.length) ? source[index] : null;
  }

  /**
   * Update the datasource with a new array of data. If the array reference
   * is the same as the previous one, it doesn't trigger an update.
   * @param data Data to update the table datasource.
   * @param options Specify options to update the datasource.
   * If emitEvent is true and the datasource is updated, it emits an event
   * from 'datasourceSubject' with the updated data. If false, it doesn't
   * emit an event. True by default.
   */
  updateDatasource(data: T[], options = { emitEvent: true }, tableConfig: any): void {
    if (this.currentData !== data) {
      this.currentData = data;
      this.rowsSubject.next(this.getRowsFromData(data, tableConfig))

      if (options.emitEvent) {
        this.datasourceSubject.next(data);
      }
    }
  }


  /**
   * Checks the existance of the a new row (not yet saved).
   * @param source
   */
  private existsNewElement(source: TableElement<T>[]): boolean {
    return !(source.length === 0 || source[this.getNewRowIndex(source)].id > -1)
  }

  /**
   * Returns the possible index of the new row depending on the insertion type.
   * It doesn't imply that the new row is created, that must be checked.
   * @param source
   */
  private getNewRowIndex(source): number {
    if (this.config.prependNewElements) {
      return 0;
    } else {
      return source.length - 1;
    }
  }

  /**
   * Returns the row id from the index specified. It does
   * not consider if the new row is present or not, assumes
   * that new row is not present.
   * @param index Index of the array.
   * @param count Quantity of elements in the array.
   */
  private getRowIdFromIndex(index: number, count: number): number {
    if (this.config.prependNewElements) {
      return count - 1 - index;
    } else {
      return index;
    }
  }

  /**
   * Returns the index from the row id specified.
   * It takes into account if the new row exists or not.
   * @param id
   * @param source
   */
  private getIndexFromRowId(id: number, source: TableElement<T>[]): number {
    if (id === -1) {
      return this.existsNewElement(source) ? this.getNewRowIndex(source) : -1;
    } else {
      if (this.config.prependNewElements) {
        return source.length - 1 - id;
      } else {
        return id;
      }
    }
  }

  /**
   * Update rows ids in the array specified, starting in the specified index
   * until the start/end of the array, depending on config.prependNewElements
   * configuration.
   * @param initialIndex Initial index of source to be updated.
   * @param source Array that contains the rows to be updated.
   */
  private updateRowIds(initialIndex: number, source: TableElement<T>[]): void {

    const delta = this.config.prependNewElements ? -1 : 1;

    for (let index = initialIndex; index < source.length && index >= 0; index += delta) {
      if (source[index].id !== -1) {
        source[index].id = this.getRowIdFromIndex(index, source.length);
      }
    }
  }

  /**
   * Get the data from the rows.
   * @param rows Rows to extract the data.
   */
  private getDataFromRows(rows: TableElement<T>[]): T[] {
    return rows
      .filter(row => row.id !== -1)
      .map<T>((row) => {
        return row.originalData ? row.originalData : row.currentData;
      });
  }

  /**
   * Update the datasource with the data contained in the specified rows.
   * @param rows Rows that contains the datasource's new data.
   */
  private updateDatasourceFromRows(rows: TableElement<T>[]): void {
    this.currentData = this.getDataFromRows(rows);
    this.datasourceSubject.next(this.currentData);
  }

  /**
   * From an array of data, it returns rows containing the original data.
   * @param arrayData Data from which create the rows.
   */
  private getRowsFromData(arrayData: T[], tableConfig: any): TableElement<T>[] {
    console.log('getRowsFromData', arrayData, tableConfig);

    return arrayData.map<TableElement<T>>((data: any, index) => {
      const validator = this.tableValidatorService.toFormGroup(tableConfig.columns, false);
      // backfill
      validator.controls['id'].setValue(data.id);
      validator.disable();
      console.log('validator', validator.controls)
      return new TableElement({
        id: this.getRowIdFromIndex(index, arrayData.length),
        editing: false,
        currentData: data,
        source: this,
        validator: validator,
      })
    });
  }

  /**
   * Create a new object with identical structure than the table source data.
   * It uses the object's type contructor if available, otherwise it creates
   * an object with the same keys of the first element contained in the original
   * datasource (used in the constructor).
   */
  private createNewObject(): T {
    if (this.dataConstructor) {
      return new this.dataConstructor();
    } else {
      return this.dataKeys.reduce((obj, key) => {
        obj[key] = undefined;
        return obj;
      }, {});
    }

  }

  /** Connect function called by the table to retrieve one stream containing
   *  the data to render. */
  connect(): Observable<TableElement<T>[]> {
    return this.rowsSubject.asObservable();
  }

  disconnect() { }
}


