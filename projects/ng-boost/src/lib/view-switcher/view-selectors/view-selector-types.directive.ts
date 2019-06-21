import { Directive, Input } from '@angular/core';
import { AvailableViewType } from '../_models/view-switcher.model';
import { BoostViewSelector } from './view-selector';


@Directive({
  selector: '[boostViewTable],[boost-view-table]'
})
export class ViewTableDirective extends BoostViewSelector {
  viewType: AvailableViewType = 'table';
}

@Directive({
  selector: '[boostViewGrid],[boost-view-grid]'
})
export class ViewGridDirective extends BoostViewSelector {
  viewType: AvailableViewType = 'grid';
}

@Directive({
  selector: '[boostView],[boost-view]'
})
export class ViewDirective extends BoostViewSelector {
  @Input('boost-view') viewType: AvailableViewType;

  @Input('boostView')
  set boostView(val: AvailableViewType) {
    this.viewType = val;
  }
}



