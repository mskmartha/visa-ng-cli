import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material';
@Component({
  selector: 'app-snack-bar-error',
  template: `
    <div class="error">
      <mat-icon class="material-icons mat-24 text-danger">error</mat-icon> <h5>{{ data || 'Something went wrong!'}}</h5>
    </div>
  `,
  styles: [`
    .error {
      text-align: center;
    }
    mat-icon{
      color: #fff;
    }
  `],
})
export class SnackBarErrorComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}



@Component({
  selector: 'app-snack-bar-success',
  template: `
    <div class="success">
      <mat-icon class="material-icons mat-24">check_circle</mat-icon> <h5>{{ data || 'Submit Successful!'}}</h5>
    </div>
  `,
  styles: [`
    .success {
      text-align: center;
    }
    mat-icon{
       color: #fff;
     }
  `],
})
export class SnackBarSuccessComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}
