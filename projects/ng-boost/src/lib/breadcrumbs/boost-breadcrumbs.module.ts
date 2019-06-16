import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoostBreadcrumbsComponent } from './breadcrumbs/boost-breadcrumbs.component';
import { RouterModule } from '@angular/router';
import { BoostBreadcrumbsService } from './_services/boost-breadcrumbs.service';

/**
 * To use breadcrumbs add the following structure to the route definition:
 *
 * ```typescript
 * {
 *   path: 'home',
 *   component: HomeComponent,
 *   data: {
 *     breadcrumbs: 'Home'
 *   }
 * }
 * ```
 *
 * It will automatically detect and apply all the children nodes.
 * To dynamically setup a breadcumb you have to create a dedicated service,
 * which inherits from `BreadcrumbsResolver` and pass it's class name instead
 * of the raw breadcrumb string:
 *
 * ```typescript
 * @Injectable()
 * class SimpleTestResolver extends BreadcrumbsResolver {
 *     resolve(
 *         route: ActivatedRouteSnapshot,
 *         state: RouterStateSnapshot
 *     ): Observable<Breadcrumb[]> | Promise<Breadcrumb[]> | Breadcrumb[] {
 *         return [{
 *           text: 'overriten-text',
 *           path: '/overriden-path'
 *         }];
 *     }
 * }
 *
 * // routes
 * {
 *   path: 'home',
 *   component: HomeComponent,
 *   data: {
 *     breadcrumbs: SimpleTestResolver
 *   }
 * }
 * ```
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  declarations: [
    BoostBreadcrumbsComponent
  ],
  exports: [
    BoostBreadcrumbsComponent
  ]
})
export class BoostBreadcrumbsModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: BoostBreadcrumbsModule,
      providers: [
        BoostBreadcrumbsService
      ]
    };
  }
}
