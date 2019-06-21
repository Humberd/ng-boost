import { Directive, Input } from '@angular/core';
import { AvailableViewType } from '../_models/view-switcher.model';
import { BoostViewSelector } from './view-selector';


@Directive({
  selector: '[boostViewTable],[boost-view-table]'
})
export class BoostViewTableDirective extends BoostViewSelector {
  viewType: AvailableViewType = 'table';
}

@Directive({
  selector: '[boostViewGrid],[boost-view-grid]'
})
export class BoostViewGridDirective extends BoostViewSelector {
  viewType: AvailableViewType = 'grid';
}

@Directive({
  selector: '[boostView],[boost-view]'
})
export class BoostViewDirective extends BoostViewSelector {
  @Input('boost-view') viewType: AvailableViewType;

  @Input('boostView')
  set boostView(val: AvailableViewType) {
    this.viewType = val;
  }
}



