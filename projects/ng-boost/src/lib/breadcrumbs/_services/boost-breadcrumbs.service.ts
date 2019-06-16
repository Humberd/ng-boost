import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { Breadcrumb, BREADCRUMBS_FIELD_NAME } from '../_models/breadcrumb';
import { DefaultBreadcrumbsResolver } from './default-breadcrumbs.resolver';
import { wrapIntoObservable } from './breadcrumbs.shared';
import { BreadcrumbsResolver } from '../_models/breadcrumbs.resolver';
import { RouterUtilsService } from '../../../orbital-shared/router-utils/router-utils.service';

@Injectable()
export class BoostBreadcrumbsService {
  private defaultResolver = new DefaultBreadcrumbsResolver();
  private _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

  breadcrumbs$ = this._breadcrumbs$.asObservable();

  constructor(private router: Router,
              private injector: Injector,
              private routerUtils: RouterUtilsService) {
    this.router.events
      .pipe(
        filter(it => it instanceof NavigationEnd),
        switchMap(() => this._resolveCrumbs()),
        map(it => ([].concat(...it)))
      )
      .subscribe(x => {
        this._breadcrumbs$.next(x);
      });
  }

  private _resolveCrumbs(): Observable<Breadcrumb[][]> {
    const routesChain = this.routerUtils.getCurrentRoutesChain();

    const routesToDisplay = routesChain
      .map(it => this.resolveBreadcrumbs(it.snapshot))
      .filter(it => !!it);

    return combineLatest(routesToDisplay);
  }

  private resolveBreadcrumbs(route: ActivatedRouteSnapshot): Observable<Breadcrumb[]> {
    const data = route.routeConfig &&
      route.routeConfig.data;

    if (data && data[BREADCRUMBS_FIELD_NAME]) {

      let resolver: BreadcrumbsResolver;

      if (data[BREADCRUMBS_FIELD_NAME].prototype instanceof BreadcrumbsResolver) {
        resolver = this.injector.get<BreadcrumbsResolver>(data[BREADCRUMBS_FIELD_NAME]);
      } else {
        resolver = this.defaultResolver;
      }

      const result = resolver.resolve(route, this.router.routerState.snapshot);

      return wrapIntoObservable<Breadcrumb[]>(result)
        .pipe(
          catchError(err => {
            console.error(err);
            return of([]);
          })
        );
    }
  }
}

