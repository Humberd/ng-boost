import { BehaviorSubject } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Inject, Injectable, Provider } from '@angular/core';
import {
  AvailableViewType,
  VIEW_SWITCHER_LOCAL_CONFIG_TOKEN,
  VIEW_SWITCHER_ROOT_CONFIG_TOKEN,
  ViewType,
  ViewTypesLocalConfig,
  ViewTypesRootConfig
} from '../_models/view-switcher.model';


@Injectable()
export class BoostViewSwitcherService {
  private readonly _selectedView$ = new BehaviorSubject<AvailableViewType>(null);
  readonly selectedView$ = this._selectedView$.asObservable();

  private readonly config: Required<ViewTypesLocalConfig>;

  constructor(@Inject(VIEW_SWITCHER_LOCAL_CONFIG_TOKEN) localConfig: ViewTypesLocalConfig,
              @Inject(VIEW_SWITCHER_ROOT_CONFIG_TOKEN) rootConfig: ViewTypesRootConfig,
              private liveAnnouncer: LiveAnnouncer) {
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

    this.liveAnnouncer.announce(`Switched to ${viewType} view`);
  }

  static configure(localConfig: ViewTypesLocalConfig): Provider[] {
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
