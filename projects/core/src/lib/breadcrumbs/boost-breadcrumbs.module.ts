import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BoostBreadcrumbsService } from './_services/boost-breadcrumbs.service';
import { BreadcrumbsResolver, DefaultBreadcrumbsResolver } from './_services/breadcrumbs.resolver';
import { BoostBreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';

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

  static forRoot(): ModuleWithProviders<BoostBreadcrumbsModule> {
    return {
      ngModule: BoostBreadcrumbsModule,
      providers: [
        BoostBreadcrumbsService,
        {
          provide: BreadcrumbsResolver,
          useClass: DefaultBreadcrumbsResolver,
        },
      ],
    };
  }
}
