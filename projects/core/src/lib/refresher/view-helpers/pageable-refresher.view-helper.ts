import { Injectable } from '@angular/core';
import { RefresherViewHelper } from './view-helper';
import { PageableDataRefresher } from '../impl/pageable-data-refresher';

@Injectable()
export class PageableRefresherViewHelper extends RefresherViewHelper {
  constructor(private refresher: PageableDataRefresher<any>) {
    super(refresher);
  }

  shouldDisplayContentView(): boolean {
    return !this.refresher.isError && this.refresher.isInitialized && !this.refresher.isLoading && this.refresher.itemsCount > 0;
  }

  shouldDisplayEmptyView(): boolean {
    return !this.refresher.isError && this.refresher.isInitialized && !this.refresher.isLoading && this.refresher.itemsCount === 0;
  }

  shouldDisplayLoaderView(): boolean {
    return !this.refresher.isError && !this.refresher.isInitialized && this.refresher.isLoading;
  }

  shouldDisplayErrorView(): boolean {
    return this.refresher.isError;
  }
}
