import { Injectable, Injector } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Params,
  QueryParamsHandling,
  Resolve,
  Router,
  UrlSegment,
} from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, pluck } from 'rxjs/operators';
import { safeResolve } from './safe-resolve';
import { wrapIntoObservable } from './rxjs';

export interface ResolveRouteDataConfig<T> {
  route: ActivatedRouteSnapshot;
  resolverBaseClass: any;
  fieldName: string;
  defaultResolver: Resolve<T>;
  emptyValue: any;
}

@Injectable({
  providedIn: 'root'
})
export class RouterUtilsService {

  constructor(private router: Router,
              private injector: Injector) {
  }

  /**
   * Traverses a router tree from root to a leaf looking for {@param}.
   */
  getParam(param: string): string {
    for (const route of this.getCurrentRoutesChain()) {
      if (route.snapshot.paramMap.has(param)) {
        return route.snapshot.paramMap.get(param);
      }
    }
    return undefined;
  }

  /**
   * Traverses a router tree from root to a leaf looking for {@param}.
   */
  getParam$(param: string): Observable<string> {
    for (const route of this.getCurrentRoutesChain()) {
      if (route.snapshot.paramMap.has(param)) {
        return route.params.pipe(pluck(param));
      }
    }
    return EMPTY;
  }

  /**
   * Retrieves a chain of {ActivatedRoutes} from root to a leaf.
   */
  getCurrentRoutesChain(): ActivatedRoute[] {
    let currentRoute = this.router.routerState.root;
    const results: ActivatedRoute[] = [currentRoute];

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
      results.push(currentRoute);
    }

    return results;
  }

  /**
   * Resolves given {route} `data` element provided in a route definition with
   * either a {defaultResolver} or dynamic resolver of type {resolverBaseClass}
   */
  resolveRouteData<T>(config: ResolveRouteDataConfig<T>): Observable<T> {
    const routeData = safeResolve(() => config.route.routeConfig.data[config.fieldName]);

    if (!routeData) {
      return of(config.emptyValue);
    }

    let resolver = config.defaultResolver;

    if (routeData.prototype instanceof config.resolverBaseClass) {
      resolver = this.injector.get(routeData);
    }

    const result = resolver.resolve(config.route, this.router.routerState.snapshot);

    return wrapIntoObservable<T>(result)
      .pipe(
        catchError(err => {
          console.error(err);
          return of(config.emptyValue);
        })
      );
  }

  /**
   * Generates a complete path from root to a selected {route}
   */
  getFullPath(route: ActivatedRouteSnapshot): string {
    const relativePath = (segments: UrlSegment[]) => segments.reduce((a, v) => a += '/' + v.path, '');
    const fullPath = (routes: ActivatedRouteSnapshot[]) => routes.reduce((a, v) => a += relativePath(v.url), '');

    return fullPath(route.pathFromRoot);
  }

  /**
   * Updates query params for the current route.
   */
  updateQueryParams(queryParams: Params, queryParamsHandling: QueryParamsHandling = 'merge') {
    return this.router.navigate(
      [],
      {
        relativeTo: this.router.routerState.root,
        queryParams,
        queryParamsHandling
      });
  }
}
