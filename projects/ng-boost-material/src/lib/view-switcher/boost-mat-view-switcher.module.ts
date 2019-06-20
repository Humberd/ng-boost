import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoostMatViewSwitcherComponent } from './view-switcher/boost-mat-view-switcher.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [BoostMatViewSwitcherComponent],
  exports: [BoostMatViewSwitcherComponent]
})
export class BoostMatViewSwitcherModule { }
