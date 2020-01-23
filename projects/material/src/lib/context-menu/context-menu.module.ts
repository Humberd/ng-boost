import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoostMatContextMenuTriggerForDirective } from './directives/boost-mat-context-menu-for.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [BoostMatContextMenuTriggerForDirective],
  exports: [BoostMatContextMenuTriggerForDirective],
})
export class BoostMatContextMenuModule {
}
