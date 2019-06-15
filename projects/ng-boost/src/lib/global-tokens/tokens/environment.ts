import { InjectionToken, Provider } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { EnvSchema } from '../../../../environments/env-schema';

export const ENVIRONMENT_TOKEN = new InjectionToken<EnvSchema>('Environment object');

export const environmentProvider: Provider = {
  provide: ENVIRONMENT_TOKEN,
  useValue: environment
};
