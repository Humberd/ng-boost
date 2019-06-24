import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AvailableViewType, BoostViewSwitcherService, ViewType } from '@ng-boost/core';

export type BoostMatViewSwitcherOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'boost-mat-view-switcher',
  templateUrl: './boost-mat-view-switcher.component.html',
  styleUrls: ['./boost-mat-view-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoostMatViewSwitcherComponent implements OnInit {
  @Input() orientation: BoostMatViewSwitcherOrientation = 'horizontal';
  notSelectedViews$: Observable<ViewType[]>;

  constructor(private viewSwitcher: BoostViewSwitcherService) {

  }

  ngOnInit(): void {
    this.notSelectedViews$ = this.viewSwitcher
      .selectedView$
      .pipe(
        map(() => this.viewSwitcher.getNotSelected())
      );
  }

  trackBy(index: number, listType: ViewType) {
    return listType.id;
  }

  selectView(id: AvailableViewType) {
    this.viewSwitcher.selectedView = id;
  }


}
