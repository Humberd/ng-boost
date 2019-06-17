import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Breadcrumb } from '../_models/breadcrumb';
import { BreadcrumbsResolver } from './breadcrumbs.resolver';
import { isObject } from '../../utils/is';
import { Injectable } from '@angular/core';
import { BoostBreadcrumbsService } from './boost-breadcrumbs.service';
import { RouterUtilsService } from '../../utils/router-utils.service';

@Injectable()
export class BreadcrumbsDefaultResolver extends BreadcrumbsResolver {

  constructor(private routerUtilsService: RouterUtilsService) {
    super();
  }

  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Breadcrumb[]> | Promise<Breadcrumb[]> | Breadcrumb[] {

    let breadcrumbsPath = this.routerUtilsService.getFullPath(route);

    const routerData = route.routeConfig.data[BoostBreadcrumbsService.ROUTE_DATA_FIELD_NAME];

    let breadcrumbLabel: string;

    if (typeof routerData === 'string') {
      breadcrumbLabel = routerData;
    } else if (isObject(routerData)) {
      breadcrumbLabel = (routerData as Breadcrumb).label;
      breadcrumbsPath = (routerData as Breadcrumb).href;
    } else {
      // tslint:disable-next-line:max-line-length
      throw Error(`${BoostBreadcrumbsService.ROUTE_DATA_FIELD_NAME} value type is not supported. Should be a string or a Breadcrumb type object`);
    }

    const crumbs: Breadcrumb[] = [{
      label: breadcrumbLabel,
      href: breadcrumbsPath
    }];

    return of(crumbs);
  }
}
