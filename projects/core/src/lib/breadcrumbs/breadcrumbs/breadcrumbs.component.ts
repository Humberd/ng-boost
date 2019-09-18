import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';
import { Breadcrumb } from '../_models/breadcrumb';

@Component({
  selector: 'boost-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoostBreadcrumbsComponent {
  @Input() breadcrumbs: Breadcrumb[];
  @Input() separator: TemplateRef<any>;
}
