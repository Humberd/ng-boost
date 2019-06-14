import { Directive, Input } from '@angular/core';
import { ViewSelector } from './view-selector';
import { AvailableViewType } from '../_models/view-switcher.model';


@Directive({
  selector: '[boostViewTable],[boost-view-table]'
})
export class ViewTableDirective extends ViewSelector {
  viewType: AvailableViewType = 'table';
}

@Directive({
  selector: '[boostViewGrid],[boost-view-grid]'
})
export class ViewGridDirective extends ViewSelector {
  viewType: AvailableViewType = 'grid';
}

@Directive({
  selector: '[boostView],[boost-view]'
})
export class ViewDirective extends ViewSelector {
  @Input('boostView') viewType: AvailableViewType;
}



