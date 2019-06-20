import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoostMatViewSwitcherComponent } from './view-switcher/boost-mat-view-switcher.component';
import { MatButtonModule, MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  declarations: [BoostMatViewSwitcherComponent],
  exports: [BoostMatViewSwitcherComponent]
})
export class BoostMatViewSwitcherModule { }
