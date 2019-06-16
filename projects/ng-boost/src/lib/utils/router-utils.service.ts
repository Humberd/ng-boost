import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouterUtilsService {

  constructor(private router: Router) {
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

  getParam$(param: string): Observable<string> {
    for (const route of this.getCurrentRoutesChain()) {
      if (route.snapshot.paramMap.has(param)) {
        return route.paramMap.pipe(map(it => it.get(param)));
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
}
