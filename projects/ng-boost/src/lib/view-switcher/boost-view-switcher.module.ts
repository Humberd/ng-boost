import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewDirective, ViewGridDirective, ViewTableDirective } from './view-selectors/view-selector-types.directive';
import { defaultViewTypes, VIEW_SWITCHER_DEFAULT_ROOT_CONFIG, ViewSwitcherRootConfig } from './_models/view-switcher.model';
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
  ],
  providers: [
    {
      provide: VIEW_SWITCHER_DEFAULT_ROOT_CONFIG,
      useValue: {
        defaultType: 'table',
        storage: localStorage,
        viewTypes: defaultViewTypes(),
      } as ViewSwitcherRootConfig
    }
  ]
})
export class BoostViewSwitcherModule {
}
