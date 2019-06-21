import { Component, OnInit } from '@angular/core';
import { BoostViewSwitcherService } from '../../../../../../../ng-boost/src/lib/view-switcher/_services/boost-view-switcher.service';

@Component({
  selector: 'app-view-switcher-custom',
  templateUrl: './view-switcher-custom.component.html',
  styleUrls: ['./view-switcher-custom.component.scss'],
  viewProviders: [
    BoostViewSwitcherService.configure({
      storageKey: 'view-switcher-example-test-custom'
    })
  ]
})
export class ViewSwitcherCustomComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
