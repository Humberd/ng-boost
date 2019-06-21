import { Component, OnInit } from '@angular/core';
import { BoostViewSwitcherService } from 'ng-boost';

@Component({
  selector: 'app-view-switcher-default',
  templateUrl: './view-switcher-default.component.html',
  styleUrls: ['./view-switcher-default.component.scss'],
  viewProviders: [
    BoostViewSwitcherService.configure({
      storageKey: 'view-switcher-example-test-default'
    })
  ]
})
export class ViewSwitcherDefaultComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}