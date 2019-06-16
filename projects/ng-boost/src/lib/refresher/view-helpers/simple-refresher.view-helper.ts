import { Injectable } from '@angular/core';
import { RefresherViewHelper } from './view-helper';
import { SimpleDataRefresher } from '../impl/simple-data-refresher';

@Injectable()
export class SimpleRefresherViewHelper extends RefresherViewHelper {
  constructor(protected refresher?: SimpleDataRefresher<any>) {
    super(refresher);
  }

  shouldDisplayContentView(): boolean {
    return !this.refresher.isError && this.refresher.isInitialized && !this.refresher.isLoading && this.refresher.data;
  }

  shouldDisplayEmptyView(): boolean {
    return !this.refresher.isError && this.refresher.isInitialized && !this.refresher.isLoading && !this.refresher.data;
  }

  shouldDisplayLoaderView(): boolean {
    return !this.refresher.isError && !this.refresher.isInitialized && this.refresher.isLoading;
  }

  shouldDisplayErrorView(): boolean {
    return this.refresher.isError;
  }
}
