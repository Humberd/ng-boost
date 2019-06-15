import { NgModule } from '@angular/core';
import { locationProvider } from './tokens/location';
import { environmentProvider } from './tokens/environment';
import { localStorageProvider } from './tokens/local-storage';
import { sessionStorageProvider } from './tokens/session-storage';


/**
 * This module changes the way components and services use global variables.
 * Instead of using `location.href = 'https://google.com/'`
 * a component should inject it in a constructor, for example:
 *
 * @Component({...})
 * class Foo {
 *
 *   constructor(@Inject(LOCATION_TOKEN) private location: Location) {
 *   }
 *
 *   otherMethod() {
 *     this.location.href = 'https://google.com/'
 *   }
 * }
 *
 * Why?
 * Because it makes testing easier.
 */
@NgModule({
  providers: [
    locationProvider,
    environmentProvider,
    localStorageProvider,
    sessionStorageProvider
  ],
  declarations: []
})
export class GlobalTokensModule {
}
