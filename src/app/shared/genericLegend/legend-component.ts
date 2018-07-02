import {Component, Input} from '@angular/core';
@Component({
  selector: 'app-legend-component',
  entryComponents: [],
  template: `
    <!--<mat-icon>check_circle</mat-icon>-->
    <div class="clearfix">
      <svg width="450" height="30">
        <g class="legends4" transform="translate(0,0)">
          <circle cx="5" cy="6" r="5" [attr.fill]="legendData[10].color"></circle>
          <text x="20" y="12" class="textselected">{{legendData[10].label}}</text>
        </g>
        <g class="legends4" transform="translate(120,0)">
          <circle cx="0" cy="6" r="5"  [attr.fill]="legendData[3].color"></circle>
          <text x="20" y="12" class="textselected">{{legendData[3].label}}</text>
        </g>
        <g class="legends4" transform="translate(240,0)">
          <circle cx="0" cy="6" r="5"  [attr.fill]="legendData[11].color"></circle>
          <text x="20" y="12" class="textselected">{{legendData[11].label}}</text>
        </g>
        <g class="legends4" transform="translate(360,0)">
          <circle cx="0" cy="6" r="5"  [attr.fill]="legendData[5].color"></circle>
          <text x="20" y="12" class="textselected">{{legendData[5].label}}</text>
        </g>
      </svg>
    </div>
  `,
  styles: [`
    svg{
        float: right;
    }
    svg text{
        text-anchor: start; 
        font-size: 12px;
    }
  `]
})
export default class GenericStatesLegendComponent {
  @Input() legendData;
  constructor() {
  }
}
