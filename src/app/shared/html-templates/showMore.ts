import {Component, Input, OnInit} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { GlobalSharedService } from '../../shared/shared.service';
@Component({
  selector : 'app-show-more',
  template: `<div class="scrollbar">{{model.data.comments | json}}</div>`,
  providers: [GlobalSharedService],
})
export class ShowMoreComponent implements OnInit {
  @Input() model: any;
  constructor(private sharedService: GlobalSharedService) {
    // view pssl prefill camr
    this.sharedService.saveData('resizeModal', '80%');
  }
  ngOnInit() {
    console.log('this.model', this.model);
  }
}

