import { Injectable, Injector } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, pluck } from 'rxjs/operators';
import { wrapIntoObservable } from '../breadcrumbs/_services/breadcrumbs.shared';
import { safeResolve } from './safe-resolve';

export interface ResolveRouteDataConfig<T> {
  route: ActivatedRouteSnapshot;
  resolverBaseClass: any;
  fieldName: string;
  defaultResolver: Resolve<T>;
  emptyValue: any;
}

@Injectable()
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
}
