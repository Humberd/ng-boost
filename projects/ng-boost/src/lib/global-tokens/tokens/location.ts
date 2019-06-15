import { InjectionToken, Provider } from '@angular/core';

export const LOCATION_TOKEN = new InjectionToken<Location>('Location object');

export const locationProvider: Provider = {
  provide: LOCATION_TOKEN,
  useFactory: locationFactory
};

export function locationFactory() {
  return window.location;
}
