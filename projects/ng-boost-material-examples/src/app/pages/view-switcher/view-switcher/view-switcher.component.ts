import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BoostViewSwitcherService } from 'ng-boost';

@Component({
  selector: 'app-view-switcher',
  templateUrl: './view-switcher.component.html',
  styleUrls: ['./view-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    BoostViewSwitcherService.configure({
      storageKey: 'view-switcher-test'
    })
  ]
})
export class ViewSwitcherComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
