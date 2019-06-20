import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AvailableViewType, BoostViewSwitcherService, ViewType } from 'ng-boost';

@Component({
  selector: 'boost-mat-view-switcher',
  templateUrl: './boost-mat-view-switcher.component.html',
  styleUrls: ['./boost-mat-view-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class BoostMatViewSwitcherComponent implements OnInit {
  notSelectedViews$: Observable<ViewType[]>;

  constructor(public viewSwitcher: BoostViewSwitcherService) {
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
