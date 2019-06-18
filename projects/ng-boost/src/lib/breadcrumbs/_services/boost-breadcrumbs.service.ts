import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { Breadcrumb } from '../_models/breadcrumb';
import { BreadcrumbsDefaultResolver } from './breadcrumbs-default.resolver';
import { RouterUtilsService } from '../../utils/router-utils.service';
import { Destroy$ } from '../../utils/destroy';
import { BreadcrumbsResolver } from './breadcrumbs.resolver';
import { reemitWhen } from '../../utils/rxjs';

@Injectable()
export class BoostBreadcrumbsService {
  static readonly EMPTY_BREADCRUMBS = [];
  static readonly ROUTE_DATA_FIELD_NAME = 'breadcrumbs';

  @Destroy$() private readonly destroy$ = new Subject();
  private readonly refresh$ = new Subject();

  private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>(BoostBreadcrumbsService.EMPTY_BREADCRUMBS);
  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  get breadcrumbs() {
    return this._breadcrumbs$.value;
  }

  constructor(private router: Router,
              private injector: Injector,
              private routerUtils: RouterUtilsService,
              private defaultResolver: BreadcrumbsDefaultResolver
  ) {
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter(it => it instanceof NavigationEnd),
        reemitWhen(this.refresh$),
        switchMap(() => this._resolveCrumbs()),
        map(it => ([].concat(...it)))
      )
      .subscribe(x => {
        this._breadcrumbs$.next(x);
      });
  }

  refresh() {
    this.refresh$.next();
  }

  private _resolveCrumbs(): Observable<Breadcrumb[][]> {
    const routesChain = this.routerUtils.getCurrentRoutesChain();

    const routesToDisplay = routesChain
      .map(it => this.resolveBreadcrumbs(it.snapshot))
      .filter(it => !!it);

    return combineLatest(routesToDisplay);

    // return from(routesChain)
    //   .pipe(
    //     switchMap(it => this.resolveBreadcrumbs(it.snapshot)),
    //     toArray()
    //   );
  }

  private resolveBreadcrumbs(route: ActivatedRouteSnapshot): Observable<Breadcrumb[]> {
    return this.routerUtils.resolveRouteData({
      emptyValue: BoostBreadcrumbsService.EMPTY_BREADCRUMBS,
      fieldName: BoostBreadcrumbsService.ROUTE_DATA_FIELD_NAME,
      resolverBaseClass: BreadcrumbsResolver,
      route,
      defaultResolver: this.defaultResolver
    });

  }
}

