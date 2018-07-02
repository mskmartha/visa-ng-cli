import {Component, Input, OnInit} from '@angular/core';
@Component({
  selector : 'app-confirm-delete',
  template: `<div>
    <p>{{ model.data.message }}</p>
    <mat-card-actions align="end" class="col-lg-12">
      <button type="button" mat-raised-button class="cta-2 cancel" mat-dialog-close="cancel">Cancel</button>
      <button type="button" mat-raised-button class="cta-1" mat-dialog-close="confirm">Confirm</button>
    </mat-card-actions>
  </div>`,
  providers: [],
})
export class ConfirmDeleteComponent implements OnInit {
  @Input() model: any;
  constructor() {
  }
  ngOnInit() {
  }
}

