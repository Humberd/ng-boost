import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BoostBreadcrumbsService } from './_services/boost-breadcrumbs.service';
import { BreadcrumbsResolver, DefaultBreadcrumbsResolver } from './_services/breadcrumbs.resolver';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
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
        }
      ]
    };
  }
}
