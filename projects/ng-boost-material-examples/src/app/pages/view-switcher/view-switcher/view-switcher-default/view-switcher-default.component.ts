import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ViewSwitcherConfig } from 'ng-boost';

@Component({
  selector: 'app-view-switcher-default',
  templateUrl: './view-switcher-default.component.html',
  styleUrls: ['./view-switcher-default.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewSwitcherDefaultComponent {

  options: ViewSwitcherConfig = {
    storageKey: 'foobar'
  };

}
