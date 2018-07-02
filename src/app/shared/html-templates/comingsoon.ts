import {Component} from '@angular/core'

@Component({
  selector: 'coming-soon',
  template: `
        <div class="row">
        <div class="col-sm-12 col-md-12 col-xl-12 image">
            <img src="assets/img/artboard-1.png"
            srcset="assets/img/artboard-1@2x.png 2x,
                    assets/img/artboard-1@3x.png 3x"
            class="sl-banner">
                <h2 class="textOverImage">Coming Soon ...</h2>
            </div>
        </div>
  `,
  styles:[`
    .loading { font-weight: normal; padding:50px; height:250px;}
    .sl-banner{
        width:100%;
    }
    .image h2.textOverImage { 
        position: absolute; 
        top: 80px; 
        left: 50px; 
        width: 100%; 
        font-family: "Open Sans";
        color:#fff;
        font-size:30px;
    }
  `]
})
export class ComingSoonTemplate {

}
