import { Component } from '@angular/core';
import { BoostBreadcrumbsService } from '../_services/boost-breadcrumbs.service';

@Component({
  selector: 'boost-breadcrumbs',
  templateUrl: './boost-breadcrumbs.component.html',
  styleUrls: ['./boost-breadcrumbs.component.scss'],
})
export class BoostBreadcrumbsComponent {
  constructor(public breadcrumbsService: BoostBreadcrumbsService) {
  }
}
