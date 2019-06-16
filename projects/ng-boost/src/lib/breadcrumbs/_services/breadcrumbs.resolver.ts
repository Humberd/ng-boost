import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { Breadcrumb } from '../_models/breadcrumb';

export abstract class BreadcrumbsResolver implements Resolve<Breadcrumb[]> {
  abstract resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Breadcrumb[]> | Promise<Breadcrumb[]> | Breadcrumb[];

  protected getFullPath(route: ActivatedRouteSnapshot): string {
    const relativePath = (segments: UrlSegment[]) => segments.reduce((a, v) => a += '/' + v.path, '');
    const fullPath = (routes: ActivatedRouteSnapshot[]) => routes.reduce((a, v) => a += relativePath(v.url), '');

    return fullPath(route.pathFromRoot);
  }
}
