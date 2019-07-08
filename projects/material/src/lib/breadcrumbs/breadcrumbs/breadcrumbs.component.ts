import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BoostBreadcrumbsService } from '@ng-boost/core';

@Component({
  selector: 'boost-mat-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbsComponent {

  constructor(public breadcrumbsService: BoostBreadcrumbsService) {
  }

}
