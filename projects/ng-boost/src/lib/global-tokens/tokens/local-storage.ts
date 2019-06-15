import { InjectionToken, Provider } from '@angular/core';

export const LOCAL_STORAGE_TOKEN = new InjectionToken<Storage>('Local Storage object');

export const localStorageProvider: Provider = {
  provide: LOCAL_STORAGE_TOKEN,
  useFactory: localStorageFactory
};

export function localStorageFactory() {
  return window.localStorage;
}
