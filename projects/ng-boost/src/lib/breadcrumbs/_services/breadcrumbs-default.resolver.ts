import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Breadcrumb } from '../_models/breadcrumb';
import { BreadcrumbsResolver } from './breadcrumbs.resolver';
import { ROUTE_DATA_FIELD_NAME } from './boost-breadcrumbs.service';
import { isObject } from '../../utils/is';
import { Injectable } from '@angular/core';

@Injectable()
export class BreadcrumbsDefaultResolver extends BreadcrumbsResolver {
  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Breadcrumb[]> | Promise<Breadcrumb[]> | Breadcrumb[] {

    let breadcrumbsPath = this.getFullPath(route);

    const routerData = route.routeConfig.data[ROUTE_DATA_FIELD_NAME];

    let breadcrumbLabel: string;

    if (typeof routerData === 'string') {
      breadcrumbLabel = routerData;
    } else if (isObject(routerData)) {
      breadcrumbLabel = (routerData as Breadcrumb).label;
      breadcrumbsPath = (routerData as Breadcrumb).href;
    } else {
      throw Error(`${ROUTE_DATA_FIELD_NAME} value type is not supported. Should be a string or a Breadcrumb type object`);
    }

    const crumbs: Breadcrumb[] = [{
      label: breadcrumbLabel,
      href: breadcrumbsPath
    }];

    return of(crumbs);
  }
}
