import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ViewSwitcherConfig } from '../_models/view-switcher.model';
import { BoostViewSwitcherService } from '../_services/boost-view-switcher.service';

@Component({
  selector: 'boost-view-switcher-container',
  templateUrl: './view-switcher-container.component.html',
  styleUrls: ['./view-switcher-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    BoostViewSwitcherService
  ]
})
export class ViewSwitcherContainerComponent {
  @Input()
  set config(config: ViewSwitcherConfig) {
    this.boostViewSwitcherService.configure(config);
  }

  constructor(private boostViewSwitcherService: BoostViewSwitcherService) {
  }

}
