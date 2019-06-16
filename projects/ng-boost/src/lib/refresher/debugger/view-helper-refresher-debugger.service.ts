import { Inject, Injectable, InjectionToken } from '@angular/core';
import { RefresherViewHelper } from '../view-helpers/view-helper';
import { SESSION_STORAGE_TOKEN } from '../../global-tokens/tokens/session-storage';

interface Saver {
  oldContentViewResolver: () => boolean;
  oldEmptyViewResolver: () => boolean;
  oldLoaderViewResolver: () => boolean;
  oldErrorViewResolver: () => boolean;
}


export const VIEW_HELPER_REFRESHER_DEBUGGER_SERVICE_TREE_SHAKEABLE_TOKEN
  = new InjectionToken<ViewHelperRefresherDebuggerServiceTreeShakeable>('ViewHelperRefresherDebuggerServiceTreeShakeable');

export interface ViewHelperRefresherDebuggerServiceTreeShakeable {
  register(helper: RefresherViewHelper): void;

  unregister(helper: RefresherViewHelper): void;
}


/**
 * ATTENTION: If you want to use this service outside this module and want it to be tree-shakeable(deleted on build when neccessary)
 * you should use this token `VIEW_HELPER_REFRESHER_DEBUGGER_SERVICE_TREE_SHAKEABLE_TOKEN` instead. For example
 *
 * class Foo {
 *   constructor(@Inject(VIEW_HELPER_REFRESHER_DEBUGGER_SERVICE_TREE_SHAKEABLE_TOKEN)
 *               @Optional() debuggerService: ViewHelperRefresherDebuggerServiceTreeShakeable) {
 *      ...
 *   }
 * }
 *
 * Notice that `debuggerService` type is in fact INTERFACE instead of a CLASS!!!.
 * This is so that bundler can remove this service when unused.
 */
/* tslint:disable:no-string-literal */
@Injectable()
export class ViewHelperRefresherDebuggerService implements ViewHelperRefresherDebuggerServiceTreeShakeable {
  private readonly STORAGE_KEY = 'ng-boost.dev-tools.refresher';
  readonly refreshers: Map<RefresherViewHelper, Saver> = new Map();
  selectedState: 'content' | 'empty' | 'loader' | 'error' | null;

  constructor(@Inject(SESSION_STORAGE_TOKEN) private storage: Storage) {
    this.selectedState = storage.getItem(this.STORAGE_KEY) as any || null;
  }

  private saveState(value: string) {
    this.storage.setItem(this.STORAGE_KEY, value);
  }

  register(helper: RefresherViewHelper) {
    // Saving old method declarations
    this.refreshers.set(helper, {
      oldContentViewResolver: helper['shouldDisplayContentView'],
      oldEmptyViewResolver: helper['shouldDisplayEmptyView'],
      oldLoaderViewResolver: helper['shouldDisplayLoaderView'],
      oldErrorViewResolver: helper['shouldDisplayErrorView']
    });

    switch (this.selectedState) {
      case 'content':
        this.showContentScreen();
        break;
      case 'error':
        this.showErrorScreen();
        break;
      case 'loader':
        this.showLoadingScreen();
        break;
      case 'empty':
        this.showEmptyScreen();
        break;
    }
  }

  unregister(helper: RefresherViewHelper) {
    this.restoreMethods(helper, this.refreshers.get(helper));
    this.refreshers.delete(helper);
  }

  private restoreMethods(helper: RefresherViewHelper, saver: Saver): void {
    if (!saver) {
      return;
    }

    helper['shouldDisplayContentView'] = saver.oldContentViewResolver;
    helper['shouldDisplayEmptyView'] = saver.oldEmptyViewResolver;
    helper['shouldDisplayLoaderView'] = saver.oldLoaderViewResolver;
    helper['shouldDisplayErrorView'] = saver.oldErrorViewResolver;

    helper['updateSubjects']();
  }

  showContentScreen() {
    for (const ref of Array.from(this.refreshers.keys())) {
      this.applyState(ref, {content: true, empty: false, loader: false, error: false}, 'content');
    }
  }

  showEmptyScreen() {
    for (const ref of Array.from(this.refreshers.keys())) {
      this.applyState(ref, {content: false, empty: true, loader: false, error: false}, 'empty');
    }
  }

  showLoadingScreen(): void {
    for (const ref of Array.from(this.refreshers.keys())) {
      this.applyState(ref, {content: false, empty: false, loader: true, error: false}, 'loader');
    }
  }

  showErrorScreen(): void {
    for (const ref of Array.from(this.refreshers.keys())) {
      this.applyState(ref, {content: false, empty: false, loader: false, error: true}, 'error');
    }
  }

  reset(): void {
    for (const [helper, saver] of Array.from(this.refreshers.entries())) {
      this.restoreMethods(helper, saver);
    }
    this.saveState(null);
    this.selectedState = null;
  }

  private applyState(helper: RefresherViewHelper, {content, empty, loader, error}, state: string): void {
    helper['shouldDisplayContentView'] = () => content;
    helper['shouldDisplayEmptyView'] = () => empty;
    helper['shouldDisplayLoaderView'] = () => loader;
    helper['shouldDisplayErrorView'] = () => error;

    helper['updateSubjects']();

    this.saveState(state);
    this.selectedState = state as any;
  }
}
