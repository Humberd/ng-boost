import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TitleComponent } from './title/title.component';

const routes: Routes = [{
  path: '',
  component: TitleComponent
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TitleComponent]
})
export class TitleModule {
}
