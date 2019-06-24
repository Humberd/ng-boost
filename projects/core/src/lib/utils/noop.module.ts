import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * A component used a route component for testing purposes.
 */
@Component({
  template: ''
})
export class NoopComponent {
}

@Component({
  template: '<router-outlet></router-outlet>'
})
export class NoopOutletComponent {
}

@NgModule({
  declarations: [
    NoopComponent,
    NoopOutletComponent
  ],
  exports: [
    NoopComponent,
    NoopOutletComponent
  ],
  imports: [
    RouterModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NoopModule {
}

