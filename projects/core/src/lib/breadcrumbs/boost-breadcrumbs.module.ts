import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoostBreadcrumbsComponent } from './breadcrumbs/boost-breadcrumbs.component';
import { RouterModule } from '@angular/router';
import { BoostBreadcrumbsService } from './_services/boost-breadcrumbs.service';
import { RouterUtilsService } from '../utils/router-utils.service';
import { BreadcrumbsResolver, DefaultBreadcrumbsResolver } from './_services/breadcrumbs.resolver';

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
        BoostBreadcrumbsService,
        {
          provide: BreadcrumbsResolver,
          useClass: DefaultBreadcrumbsResolver
        },
        RouterUtilsService
      ]
    };
  }
}
