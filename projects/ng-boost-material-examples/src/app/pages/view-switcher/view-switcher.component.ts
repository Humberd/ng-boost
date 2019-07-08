import { ChangeDetectionStrategy, Component } from '@angular/core';
import { defaultViewTypes, ViewSwitcherConfig } from '@ng-boost/core';

@Component({
  selector: 'app-view-switcher',
  templateUrl: './view-switcher.component.html',
  styleUrls: ['./view-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewSwitcherComponent {
  defaultConfig: ViewSwitcherConfig = {
    storageKey: 'default-example'
  };

  customConfig: ViewSwitcherConfig = {
    storageKey: 'custom-example',
    viewTypes: [
      ...defaultViewTypes(),
      {
        id: 'list',
        icon: 'format_list_bulleted'
      },
      {
        id: 'steps',
        icon: 'assignment_turned_in'
      }
    ]
  };

  isHorizontal = true;

  toggleOrientation() {
    this.isHorizontal = !this.isHorizontal;
  }

}
