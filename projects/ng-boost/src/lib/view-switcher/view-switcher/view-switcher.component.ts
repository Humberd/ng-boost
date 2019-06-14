import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AvailableViewType, ViewSwitcherService, ViewType } from '../_services/view-switcher.service';

// import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'boost-view-switcher',
  templateUrl: './view-switcher.component.html',
  styleUrls: ['./view-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewSwitcherComponent implements OnInit {
  notSelectedListTypes$: Observable<ViewType[]>;

  constructor(public viewSwitcher: ViewSwitcherService) {
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

    // this.liveAnnouncer.announce(`Switched to ${viewId} view`);
  }

}
