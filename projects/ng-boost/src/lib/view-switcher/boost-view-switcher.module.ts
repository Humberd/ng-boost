import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoostViewSwitcherComponent } from './view-switcher/boost-view-switcher.component';
import { BoostViewDirective, BoostViewGridDirective, BoostViewTableDirective } from './view-selectors/view-selector-types.directive';
import { defaultViewTypes, VIEW_SWITCHER_ROOT_CONFIG_TOKEN, ViewTypesRootConfig } from './_models/view-switcher.model';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    BoostViewSwitcherComponent,
    BoostViewTableDirective,
    BoostViewGridDirective,
    BoostViewDirective
  ],
  exports: [
    BoostViewSwitcherComponent,
    BoostViewTableDirective,
    BoostViewGridDirective,
    BoostViewDirective
  ]
})
export class BoostViewSwitcherModule {
  static forRoot(rootConfig: ViewTypesRootConfig = {}): ModuleWithProviders {
    return {
      ngModule: BoostViewSwitcherModule,
      providers: [
        {
          provide: VIEW_SWITCHER_ROOT_CONFIG_TOKEN,
          useValue: {
            defaultType: 'table',
            storage: localStorage,
            viewTypes: defaultViewTypes(),
            ...rootConfig,
          } as ViewTypesRootConfig
        }
      ]
    };
  }
}
