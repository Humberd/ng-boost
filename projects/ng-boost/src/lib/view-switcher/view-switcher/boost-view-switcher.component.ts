import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AvailableViewType, ViewType } from '../_models/view-switcher.model';
import { BoostViewSwitcherService } from '../_services/boost-view-switcher.service';

@Component({
  selector: 'boost-view-switcher',
  templateUrl: './view-switcher.component.html',
  styleUrls: ['./view-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class BoostViewSwitcherComponent implements OnInit {
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
