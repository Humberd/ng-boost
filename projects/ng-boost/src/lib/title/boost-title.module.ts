import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BOOST_TITLE_CONFIG_TOKEN, BoostTitleConfig, BoostTitleService } from './_services/boost-title.service';
import { RouterUtilsService } from '../utils/router-utils.service';
import { DefaultTitleMainResolver, TitleMainResolver } from './_services/title.main.resolver';
import { DefaultTitleRouteResolver, TitleRouteResolver } from './_services/title.route.resolver';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class BoostTitleModule {
  static forRoot(config: BoostTitleConfig): ModuleWithProviders {
    return {
      ngModule: BoostTitleModule,
      providers: [
        BoostTitleService,
        {
          provide: TitleRouteResolver,
          useClass: DefaultTitleRouteResolver
        },
        {
          provide: TitleMainResolver,
          useClass: DefaultTitleMainResolver
        },
        {
          provide: BOOST_TITLE_CONFIG_TOKEN,
          useValue: config
        },
        RouterUtilsService
      ]
    };
  }

  constructor(boostTitleService: BoostTitleService) {

  }

}
