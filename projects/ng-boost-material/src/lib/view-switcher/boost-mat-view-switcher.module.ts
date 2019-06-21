import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoostMatViewSwitcherComponent } from './view-switcher/boost-mat-view-switcher.component';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { BoostViewSwitcherModule } from 'ng-boost';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    BoostViewSwitcherModule
  ],
  declarations: [BoostMatViewSwitcherComponent],
  exports: [
    BoostMatViewSwitcherComponent,
    BoostViewSwitcherModule
  ]
})
export class BoostMatViewSwitcherModule { }
