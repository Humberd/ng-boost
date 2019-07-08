import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ViewSwitcherComponent } from './view-switcher.component';
import { SharedModule } from '../../shared/shared.module';
import { MatButtonModule, MatIconModule, MatListModule, MatTreeModule } from '@angular/material';
import { BoostMatViewSwitcherModule } from '@ng-boost/material';

const routes: Routes = [{
  path: '',
  component: ViewSwitcherComponent
}];

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(routes),
    BoostMatViewSwitcherModule,
    MatListModule,
    MatIconModule,
    MatTreeModule,
    MatButtonModule,
  ],
  declarations: [
    ViewSwitcherComponent,
  ]
})
export class ViewSwitcherModule {
}
