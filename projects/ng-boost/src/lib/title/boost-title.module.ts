import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoostTitleService } from './_services/boost-title.service';
import { TitleDefaultRouteResolver } from './_services/title-default-route-resolver.service';
import { RouterUtilsService } from '../utils/router-utils.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class BoostTitleModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: BoostTitleModule,
      providers: [
        BoostTitleService,
        TitleDefaultRouteResolver,
        RouterUtilsService
      ]
    };
  }

}
