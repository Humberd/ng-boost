import { InjectionToken } from '@angular/core';

export type AvailableViewType = 'table' | 'grid' | string;

export interface ViewType {
  id: AvailableViewType;
  icon: string;
}

export interface ViewSwitcherConfig {
  viewTypes?: ViewType[];
  defaultType?: AvailableViewType;
  storageKey: string;
  storage?: Storage;
}


export interface ViewSwitcherRootConfig {
  viewTypes?: ViewType[];
  defaultType?: AvailableViewType;
  storage?: Storage;
}

export const VIEW_SWITCHER_ROOT_CONFIG = new InjectionToken<ViewSwitcherRootConfig>('View Switcher Root Config');

export const VIEW_SWITCHER_DEFAULT_ROOT_CONFIG = new InjectionToken<ViewSwitcherRootConfig>('View Switcher Default Root Config');

export function defaultViewTypes(): ViewType[] {
  return [
    {
      id: 'grid',
      icon: 'view_module'
    },
    {
      id: 'table',
      icon: 'view_list'
    }
  ];
}
