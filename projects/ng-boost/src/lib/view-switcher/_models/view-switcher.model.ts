import { InjectionToken } from '@angular/core';

export type AvailableViewType = 'table' | 'grid' | string;

export interface ViewType {
  id: AvailableViewType;
  icon: string;
}

export interface ViewTypesLocalConfig {
  viewTypes?: ViewType[];
  defaultType?: AvailableViewType;
  storageKey: string;
  storage?: Storage;
}

export const VIEW_SWITCHER_LOCAL_CONFIG_TOKEN = new InjectionToken<ViewTypesLocalConfig>('View Switcher Local Config');


export interface ViewTypesRootConfig {
  viewTypes?: ViewType[];
  defaultType?: AvailableViewType;
  storage?: Storage;
}

export const VIEW_SWITCHER_ROOT_CONFIG_TOKEN = new InjectionToken<ViewTypesRootConfig>('View Switcher Root Config');

export function defaultViewTypes(): ViewType[] {
  return [
    {
      id: 'grid',
      icon: 'enterprise'
    },
    {
      id: 'table',
      icon: 'list'
    }
  ];
}
