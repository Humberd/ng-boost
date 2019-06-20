import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AvailableViewType, ViewType } from '../../../../../ng-boost/src/lib/view-switcher/_models/view-switcher.model';
import { BoostViewSwitcherService } from '../../../../../ng-boost/src/lib/view-switcher/_services/boost-view-switcher.service';

@Component({
  selector: 'boost-mat-view-switcher',
  templateUrl: './boost-mat-view-switcher.component.html',
  styleUrls: ['./boost-mat-view-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class BoostMatViewSwitcherComponent implements OnInit {
  notSelectedListTypes$: Observable<ViewType[]>;

  constructor(public viewSwitcher: BoostViewSwitcherService) {
  }

  ngOnInit(): void {
    this.notSelectedListTypes$ = this.viewSwitcher
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
