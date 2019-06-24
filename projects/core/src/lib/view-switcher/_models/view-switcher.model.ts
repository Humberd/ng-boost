import { InjectionToken } from '@angular/core';

export type AvailableViewType = 'table' | 'grid' | string;

export interface ViewType {
  id: AvailableViewType;
  icon: string;
}

export interface ViewSwitcherConfig {
  /**
   * A view types list that will be available to select in the view-switcher component.
   */
  viewTypes?: ViewType[];

  /**
   * Specifies which view should be shown first.
   * Respected only when the state hadn't been saved in a storage before.
   *
   * @default 'table'
   */
  defaultType?: AvailableViewType;

  /**
   * A unique identifier, by which the view-switcher state should be saved.
   */
  storageKey: string;

  /**
   * A reference to the storage object.
   *
   * @default localStorage
   */
  storage?: Storage;
}


export interface ViewSwitcherRootConfig {
  /**
   * @see ViewSwitcherConfig.viewTypes
   */
  viewTypes?: ViewType[];

  /**
   * @see ViewSwitcherConfig.defaultType
   */
  defaultType?: AvailableViewType;

  /**
   * @see ViewSwitcherConfig.storage
   */
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
