import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BoostBreadcrumbsService, Breadcrumb } from '@ng-boost/core';

@Component({
  selector: 'boost-mat-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
  @Input() breadcrumbs: Breadcrumb[];

  constructor(public breadcrumbsService: BoostBreadcrumbsService) {
  }

}
