import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ViewSwitcherModule } from 'ng-boost';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ViewSwitcherModule.forRoot({
      storage: sessionStorage,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
