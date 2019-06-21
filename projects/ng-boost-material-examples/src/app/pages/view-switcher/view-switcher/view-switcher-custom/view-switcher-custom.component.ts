import { Component } from '@angular/core';
import { BoostViewSwitcherService, defaultViewTypes } from 'ng-boost';


@Component({
  selector: 'app-view-switcher-custom',
  templateUrl: './view-switcher-custom.component.html',
  styleUrls: ['./view-switcher-custom.component.scss'],
  viewProviders: [
    BoostViewSwitcherService.configure({
      storageKey: 'view-switcher-example-test-custom',
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
    })
  ]
})
export class ViewSwitcherCustomComponent {


}
