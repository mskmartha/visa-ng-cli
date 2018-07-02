import {Component, Input, Output, EventEmitter} from '@angular/core';

import {PSSLActionsComponent} from '../../pssl/pssl-actions.component';
import {KCCActionsComponent} from '../../kcc/kcc-actions.component';
import {ManageKCCActionsComponent} from '../../kcc/kcc-summary/manage-kcc-actions.component';
import {CSAActionsComponent} from '../../csa/csa-actions.component';
const typeMap = {
  'sa-actions': PSSLActionsComponent,
  'kcc-actions': KCCActionsComponent,
  'manage-kcc-actions': ManageKCCActionsComponent,
  'csa-actions': CSAActionsComponent,
};
@Component({
  selector: 'app-dyn-menu',
  templateUrl: 'dyn-menu.component.html',
})
export class DynMenuComponent {
  @Input() menuInfo: any;
  @Input() actnsComp: any;
  @Output() clickedItem = new EventEmitter<string>();
  componentData;
  constructor() {
  }
  clickHandler(item: string) {
    this.clickedItem.emit(item);
  }
  createActionsGearComponent(key) {
    this.componentData = {
        component: typeMap[this.actnsComp],
        inputs: {
          showNum: 9,
          id: key.id,
          saType: key.saType,
          saId: key.saId,
          applicationId: key.applicationId,
          releaseName: key.releaseName,
          releaseDate: key.releaseDate,
          saRating: key.saRatingName,
          statusId: key.statusId,
          // kcc
          isPMM: key.isPMM,
          kccType: key.kccType,
          kccTypeId: key.kccTypeId
        }
    };
  }
}
