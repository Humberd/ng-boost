import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BoostTitleService } from './boost-title.service';
import { TitleRouteResolver } from './title.route.resolver';

@Injectable()
export class TitleDefaultRouteResolver extends TitleRouteResolver {

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<string> | Promise<string> | string {

    const routerData = route.routeConfig.data[BoostTitleService.ROUTE_DATA_FIELD_NAME];

    if (!(typeof routerData === 'string')) {
      throw Error(`${BoostTitleService.ROUTE_DATA_FIELD_NAME} value type is not supported. Should be a string`);
    }

    return of(routerData);
  }

}
