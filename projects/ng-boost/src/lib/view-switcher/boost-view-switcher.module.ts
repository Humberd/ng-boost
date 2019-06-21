import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewDirective, ViewGridDirective, ViewTableDirective } from './view-selectors/view-selector-types.directive';
import { defaultViewTypes, VIEW_SWITCHER_ROOT_CONFIG_TOKEN, ViewSwitcherRootConfig } from './_models/view-switcher.model';
import { ViewSwitcherContainerComponent } from './view-switcher-container/view-switcher-container.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ViewTableDirective,
    ViewGridDirective,
    ViewDirective,
    ViewSwitcherContainerComponent
  ],
  exports: [
    ViewTableDirective,
    ViewGridDirective,
    ViewDirective,
    ViewSwitcherContainerComponent
  ]
})
export class BoostViewSwitcherModule {
  static forRoot(rootConfig: ViewSwitcherRootConfig = {}): ModuleWithProviders {
    return {
      ngModule: BoostViewSwitcherModule,
      providers: [
        // BoostViewSwitcherService,
        {
          provide: VIEW_SWITCHER_ROOT_CONFIG_TOKEN,
          useValue: {
            defaultType: 'table',
            storage: localStorage,
            viewTypes: defaultViewTypes(),
            ...rootConfig,
          } as ViewSwitcherRootConfig
        }
      ]
    };
  }
}
