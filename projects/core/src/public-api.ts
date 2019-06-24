/*
 * Public API Surface of @ng-boost/core
 */

export * from './lib/controllers/public-api';
export * from './lib/title/public-api';
export * from './lib/view-switcher/public-api';

export * from './lib/global-tokens/boost-global-tokens.module';
export { ENVIRONMENT_TOKEN } from './lib/global-tokens/tokens/environment';
export { LOCAL_STORAGE_TOKEN } from './lib/global-tokens/tokens/local-storage';
export * from './lib/global-tokens/tokens/local-storage.mock';
export { LOCATION_TOKEN } from './lib/global-tokens/tokens/location';
export { SESSION_STORAGE_TOKEN } from './lib/global-tokens/tokens/session-storage';
export * from './lib/global-tokens/tokens/session-storage.mock';


export * from './lib/utils/destroy';

