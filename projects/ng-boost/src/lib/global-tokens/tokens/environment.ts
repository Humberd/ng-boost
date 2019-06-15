import { InjectionToken, Provider } from '@angular/core';

export const ENVIRONMENT_TOKEN = new InjectionToken<any>('Environment object');

export const environmentProvider = (environment: any): Provider => {
  return {
    provide: ENVIRONMENT_TOKEN,
    useValue: environment
  };
};
