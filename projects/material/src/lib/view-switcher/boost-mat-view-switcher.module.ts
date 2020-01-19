import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoostMatViewSwitcherComponent } from './view-switcher/boost-mat-view-switcher.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BoostViewSwitcherModule } from '@ng-boost/core';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    BoostViewSwitcherModule,
    MatListModule,
  ],
  declarations: [BoostMatViewSwitcherComponent],
  exports: [
    BoostMatViewSwitcherComponent,
    BoostViewSwitcherModule
  ]
})
export class BoostMatViewSwitcherModule { }
