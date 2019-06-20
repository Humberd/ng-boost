import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ViewSwitcherComponent } from './view-switcher/view-switcher.component';
import { BoostMatViewSwitcherModule } from 'ng-boost-material';

const routes: Routes = [{
  path: '',
  component: ViewSwitcherComponent
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BoostMatViewSwitcherModule,
  ],
  declarations: [ViewSwitcherComponent]
})
export class ViewSwitcherModule {
}
