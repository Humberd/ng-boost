import { BehaviorSubject } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import {
  AvailableViewType,
  VIEW_SWITCHER_ROOT_CONFIG_TOKEN,
  ViewSwitcherConfig,
  ViewSwitcherRootConfig,
  ViewType
} from '../_models/view-switcher.model';


@Injectable()
export class BoostViewSwitcherService {
  private readonly _selectedView$ = new BehaviorSubject<AvailableViewType>(null);
  readonly selectedView$ = this._selectedView$.asObservable();

  private config: Required<ViewSwitcherConfig>;

  constructor(@Inject(VIEW_SWITCHER_ROOT_CONFIG_TOKEN) private rootConfig: ViewSwitcherRootConfig) {
  }

  configure(config: ViewSwitcherConfig): void {
    this.config = {
      viewTypes: this.rootConfig.viewTypes,
      defaultType: this.rootConfig.defaultType,
      storage: this.rootConfig.storage,
      ...config,
      storageKey: `ng-boost.selected-view-type.${config.storageKey}`
    };

    if (!this.isInViewTypes(this.config.defaultType)) {
      throw Error(`${this.config.defaultType} type does not exist in viewTypes`);
    }

    if (this.selectedView) {
      return;
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

