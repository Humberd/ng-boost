import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TitleComponent } from './title/title.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: TitleComponent
    }])
  ],
  declarations: [TitleComponent]
})
export class TitleModule {
}
