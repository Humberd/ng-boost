import { InjectionToken, Provider } from '@angular/core';

export const SESSION_STORAGE_TOKEN = new InjectionToken<Storage>('Session Storage object');

export const sessionStorageProvider: Provider = {
  provide: SESSION_STORAGE_TOKEN,
  useFactory: sessionStorageFactory
};

export function sessionStorageFactory() {
  return window.sessionStorage;
}
