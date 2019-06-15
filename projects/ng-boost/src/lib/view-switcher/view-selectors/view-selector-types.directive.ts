import { Directive, Input } from '@angular/core';
import { BoostViewSelector } from './boost-view-selector.service';
import { AvailableViewType } from '../_models/view-switcher.model';


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
  @Input('boostView') viewType: AvailableViewType;
}



