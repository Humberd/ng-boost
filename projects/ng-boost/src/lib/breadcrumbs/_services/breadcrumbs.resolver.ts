import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Breadcrumb } from '../_models/breadcrumb';

export abstract class BreadcrumbsResolver implements Resolve<Breadcrumb[]> {
  abstract resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Breadcrumb[]> | Promise<Breadcrumb[]> | Breadcrumb[];

}
