import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewSwitcherComponent } from './view-switcher/view-switcher.component';
import { ViewDirective, ViewGridDirective, ViewTableDirective } from './view-selectors/view-selector-types.directive';
import { ViewTypesRootConfig } from './_models/view-switcher.model';
import { rootViewSwitcher } from './_services/view-switcher.injectors';

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
  static forRoot(confirootConfig: ViewTypesRootConfig): ModuleWithProviders {
    return {
      ngModule: ViewSwitcherModule,
      providers: [
        rootViewSwitcher(confirootConfig)
      ]
    };
  }
}
