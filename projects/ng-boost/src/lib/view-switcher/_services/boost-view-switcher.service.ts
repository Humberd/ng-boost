import { BehaviorSubject } from 'rxjs';
import { Inject, Injectable, Provider } from '@angular/core';
import {
  AvailableViewType,
  VIEW_SWITCHER_LOCAL_CONFIG_TOKEN,
  VIEW_SWITCHER_ROOT_CONFIG_TOKEN,
  ViewSwitcherConfig,
  ViewSwitcherRootConfig,
  ViewType
} from '../_models/view-switcher.model';


@Injectable()
export class BoostViewSwitcherService {
  private readonly _selectedView$ = new BehaviorSubject<AvailableViewType>(null);
  readonly selectedView$ = this._selectedView$.asObservable();

  private readonly config: Required<ViewSwitcherConfig>;

  constructor(@Inject(VIEW_SWITCHER_LOCAL_CONFIG_TOKEN) localConfig: ViewSwitcherConfig,
              @Inject(VIEW_SWITCHER_ROOT_CONFIG_TOKEN) rootConfig: ViewSwitcherRootConfig) {
    this.config = {
      viewTypes: rootConfig.viewTypes,
      defaultType: rootConfig.defaultType,
      storage: rootConfig.storage,
      ...localConfig,
      storageKey: `ng-boost.selected-view-type.${localConfig.storageKey}`
    };

    if (!this.isInViewTypes(this.config.defaultType)) {
      throw Error(`${this.config.defaultType} type does not exist in viewTypes`);
    }

    const storageValue = this.loadFromStorage();
    if (this.isInViewTypes(storageValue)) {
      this._selectedView$.next(storageValue);
    } else {
      this._selectedView$.next(this.config.defaultType);
    }

  }

  get selectedView(): string {
    return this._selectedView$.value;
  }

  set selectedView(viewType: AvailableViewType) {
    if (!this.isInViewTypes(viewType)) {
      throw Error(`${viewType} type does not exist in viewTypes`);
    }

    this._selectedView$.next(viewType);
    this.saveToStorage(viewType);
  }

  static configure(localConfig: ViewSwitcherConfig): Provider[] {
    return [
      {
        provide: VIEW_SWITCHER_LOCAL_CONFIG_TOKEN,
        useValue: localConfig
      },
      BoostViewSwitcherService
    ];
  }

  private saveToStorage(viewType: AvailableViewType): void {
    this.config.storage.setItem(this.config.storageKey, viewType);
  }

  private loadFromStorage(): string | undefined {
    return this.config.storage.getItem(this.config.storageKey);
  }

  getNotSelected(): ViewType[] {
    return this.config.viewTypes.filter(it => it.id !== this.selectedView);
  }

  private isInViewTypes(typeId: AvailableViewType): boolean {
    return this.config.viewTypes.some(it => it.id === typeId);
  }
}

@Injectable()
export class PotentialViewSwitcherService {
  config: any;

}
