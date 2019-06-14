import { Provider } from '@angular/core';
import {
  VIEW_SWITCHER_LOCAL_CONFIG_TOKEN,
  VIEW_SWITCHER_ROOT_CONFIG_TOKEN,
  ViewTypesLocalConfig,
  ViewTypesRootConfig
} from '../_models/view-switcher.model';
import { ViewSwitcherService } from './view-switcher.service';


export function localViewSwitcher(localConfig: ViewTypesLocalConfig): Provider[] {
  return [
    {
      provide: VIEW_SWITCHER_LOCAL_CONFIG_TOKEN,
      useValue: localConfig
    },
    ViewSwitcherService
  ];
}

export function rootViewSwitcher(rootConfig: ViewTypesRootConfig): Provider[] {
  return [
    {
      provide: VIEW_SWITCHER_ROOT_CONFIG_TOKEN,
      useValue: {
        defaultType: 'table',
        storage: localStorage,
        viewTypes: ViewSwitcherService.defaultTypes(),
        ...rootConfig,
      } as ViewTypesRootConfig
    }
  ];
}
