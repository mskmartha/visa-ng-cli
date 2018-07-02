import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'custom-mat-card',
  templateUrl: './custom-mat-card.component.html',
  styleUrls: ['./custom-mat-card.component.scss']
})
export class CustomMatCardComponent implements OnInit {
  @Input() data: any = 0;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() summary = [];
  @Output() filterEmitter = new EventEmitter();
  constructor() { }

  ngOnInit() {
    this.summary = this.data.summary;
    this.title = this.data.label;
  }
  emitFilter(obj)  {
    if(this.data.name === 'departmentName' || this.data.name === 'assessmentTypeId') {
      this.filterEmitter.emit(this.data.name + ':' + obj.value + '');
    } else {
      this.filterEmitter.emit(this.data.name + ':[' + obj.value + ']');
    }
  }
}
