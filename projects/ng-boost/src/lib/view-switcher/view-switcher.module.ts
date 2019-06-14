import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewSwitcherComponent } from './view-switcher/view-switcher.component';
import { ViewDirective, ViewGridDirective, ViewTableDirective } from './view-selectors/view-selector-types.directive';
import { defaultViewTypes, VIEW_SWITCHER_ROOT_CONFIG_TOKEN, ViewTypesRootConfig } from './_models/view-switcher.model';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ViewSwitcherComponent,
    ViewTableDirective,
    ViewGridDirective,
    ViewDirective
  ],
  exports: [
    ViewSwitcherComponent,
    ViewTableDirective,
    ViewGridDirective,
    ViewDirective
  ]
})
export class ViewSwitcherModule {
  static forRoot(rootConfig: ViewTypesRootConfig = {}): ModuleWithProviders {
    return {
      ngModule: ViewSwitcherModule,
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
