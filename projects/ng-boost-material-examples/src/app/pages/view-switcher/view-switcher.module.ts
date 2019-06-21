import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ViewSwitcherComponent } from './view-switcher/view-switcher.component';
import { BoostMatViewSwitcherModule } from 'ng-boost-material';
import { SharedModule } from '../../shared/shared.module';
import { ViewSwitcherDefaultComponent } from './view-switcher/view-switcher-default/view-switcher-default.component';
import { ViewSwitcherCustomComponent } from './view-switcher/view-switcher-custom/view-switcher-custom.component';
import { MatButtonModule, MatIconModule, MatListModule, MatTreeModule } from '@angular/material';
import { BoostViewSwitcherModule } from 'ng-boost';

const routes: Routes = [{
  path: '',
  component: ViewSwitcherComponent
}];

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(routes),
    BoostViewSwitcherModule,
    BoostMatViewSwitcherModule,
    MatListModule,
    MatIconModule,
    MatTreeModule,
    MatButtonModule,
  ],
  declarations: [
    ViewSwitcherComponent,
    ViewSwitcherDefaultComponent,
    ViewSwitcherCustomComponent
  ]
})
export class ViewSwitcherModule {
}
