import { BehaviorSubject } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';
import {
  AvailableViewType,
  VIEW_SWITCHER_DEFAULT_ROOT_CONFIG,
  VIEW_SWITCHER_ROOT_CONFIG,
  ViewSwitcherConfig,
  ViewSwitcherRootConfig,
  ViewType
} from '../_models/view-switcher.model';


@Injectable()
export class BoostViewSwitcherService {
  private readonly _selectedView$ = new BehaviorSubject<AvailableViewType>(null);
  readonly selectedView$ = this._selectedView$.asObservable();

  private config: Required<ViewSwitcherConfig>;

  constructor(@Inject(VIEW_SWITCHER_DEFAULT_ROOT_CONFIG) defaultRootConfig: any,
              @Optional() @Inject(VIEW_SWITCHER_ROOT_CONFIG) rootConfig: ViewSwitcherRootConfig = {}) {

    /* {defaultRootConfig} is {any} because it threw an error when setting a type of {Required<ViewSwitcherRootConfig>}
    * `Metadata collected contains an error that will be reported at runtime: Could not resolve type Required.`
    * Version: typescript@3.4.5
    *  */
    this.config = {
      ...(defaultRootConfig as Required<ViewSwitcherRootConfig>),
      ...rootConfig,
      storageKey: ''
    };
  }

  configure(config: ViewSwitcherConfig): void {
    this.config = {
      ...this.config,
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

