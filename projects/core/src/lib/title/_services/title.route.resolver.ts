import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { ROUTE_DATA_FIELD_NAME } from '../_models/fields';

export abstract class TitleRouteResolver implements Resolve<string> {
  abstract resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<string> | Promise<string> | string;

}

@Injectable()
export class DefaultTitleRouteResolver extends TitleRouteResolver {

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<string> | Promise<string> | string {

    const routerData = route.routeConfig.data[ROUTE_DATA_FIELD_NAME];

    if (!(typeof routerData === 'string')) {
      throw Error(`${ROUTE_DATA_FIELD_NAME} value type is not supported. Should be a string`);
    }

    return of(routerData);
  }

}
