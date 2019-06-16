import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Breadcrumb, BREADCRUMBS_FIELD_NAME } from '../_models/breadcrumb';
import { stringFormat } from './breadcrumbs.shared';
import { BreadcrumbsResolver } from '../_models/breadcrumbs.resolver';

export class DefaultBreadcrumbsResolver extends BreadcrumbsResolver {
  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Breadcrumb[]> | Promise<Breadcrumb[]> | Breadcrumb[] {

    const data = route.routeConfig.data;
    const path = this.getFullPath(route);

    let text = typeof (data[BREADCRUMBS_FIELD_NAME]) === 'string'
      ? data[BREADCRUMBS_FIELD_NAME]
      : data[BREADCRUMBS_FIELD_NAME].text || data.text || path;
    text = stringFormat(text, route.data);

    const crumbs: Breadcrumb[] = [{
      text: text,
      path: path
    }];

    return of(crumbs);
  }
}
