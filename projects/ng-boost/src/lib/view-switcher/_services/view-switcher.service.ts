import { BehaviorSubject } from 'rxjs';

export type AvailableViewType = 'table' | 'grid' | string;

export interface ViewType {
  id: AvailableViewType;
  icon: string;
}

export interface ViewTypesConfig {
  viewTypes?: ViewType[];
  defaultType?: AvailableViewType;
  storageKey: string;
  storage?: Storage;
}

export abstract class ViewSwitcherService {
  private readonly _selectedView$ = new BehaviorSubject<AvailableViewType>(null);
  readonly selectedView$ = this._selectedView$.asObservable();

  private readonly config: Required<ViewTypesConfig>;

  constructor(config: ViewTypesConfig) {
    this.config = {
      viewTypes: ViewSwitcherService.defaultTypes(),
      defaultType: 'table',
      storage: localStorage,
      ...config,
      storageKey: `selected-view-type-${config.storageKey}`
    };

    if (!this.isInViewTypes(config.defaultType)) {
      throw Error(`${config.defaultType} type does not exist in viewTypes`);
    }

    const storageValue = this.loadFromStorage();
    if (this.isInViewTypes(storageValue)) {
      this._selectedView$.next(storageValue);
    } else {
      this._selectedView$.next(config.defaultType);
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

  static defaultTypes(): ViewType[] {
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
