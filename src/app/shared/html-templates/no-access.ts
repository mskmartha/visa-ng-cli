import {Component} from '@angular/core';

@Component({
  selector: 'app-no-access',
  template: `
    <div>
        <img src="assets/img/error-circle.svg"/>
        <div class="clearfix"></div>
        <h4>Forbidden - You don't have permission to access this.</h4>
    </div>
  `,
  styles: [`
    
  `]
})
export class NoAccessTemplateComponent {
}