import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { catchError, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { Breadcrumb } from '../_models/breadcrumb';
import { BreadcrumbsDefaultResolver } from './breadcrumbs-default.resolver';
import { wrapIntoObservable } from './breadcrumbs.shared';
import { RouterUtilsService } from '../../utils/router-utils.service';
import { Destroy$ } from '../../utils/destroy';
import { BreadcrumbsResolver } from './breadcrumbs.resolver';

export const ROUTE_DATA_FIELD_NAME = 'breadcrumbs';

@Injectable()
export class BoostBreadcrumbsService {
  @Destroy$() private readonly destroy$ = new Subject();
  private readonly defaultResolver = new BreadcrumbsDefaultResolver();
  private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  get breadcrumbs() {
    return this._breadcrumbs$.value;
  }

  constructor(private router: Router,
              private injector: Injector,
              private routerUtils: RouterUtilsService
  ) {
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
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

    if (data && data[ROUTE_DATA_FIELD_NAME]) {

      let resolver: BreadcrumbsResolver;

      if (data[ROUTE_DATA_FIELD_NAME].prototype instanceof BreadcrumbsResolver) {
        resolver = this.injector.get<BreadcrumbsResolver>(data[ROUTE_DATA_FIELD_NAME]);
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

