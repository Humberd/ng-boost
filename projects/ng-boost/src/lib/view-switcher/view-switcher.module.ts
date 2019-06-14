import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewSwitcherComponent } from './view-switcher/view-switcher.component';
import { ViewDirective, ViewGridDirective, ViewTableDirective } from './view-selectors/view-selector-types.directive';

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
}
