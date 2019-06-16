import { OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Refresher } from '../refresher';
import { ViewHelperRefresherDebuggerServiceTreeShakeable } from '../debugger/view-helper-refresher-debugger.service';
import { Destroy$ } from '../../utils/destroy';

export abstract class RefresherViewHelper implements OnDestroy {
  @Destroy$() private readonly destroy$ = new Subject();

  private readonly _displayContentView$ = new BehaviorSubject<boolean>(false);
  private readonly _displayEmptyView$ = new BehaviorSubject<boolean>(false);
  private readonly _displayLoaderView$ = new BehaviorSubject<boolean>(true);
  private readonly _displayErrorView$ = new BehaviorSubject<boolean>(false);

  displayContentView$ = this._displayContentView$.asObservable();
  displayEmptyView$ = this._displayEmptyView$.asObservable();
  displayLoaderView$ = this._displayLoaderView$.asObservable();
  displayErrorView$ = this._displayErrorView$.asObservable();

  constructor(refresher: Refresher<any, any>,
              private viewHelperRefresherDebuggerService?: ViewHelperRefresherDebuggerServiceTreeShakeable) {
    if (viewHelperRefresherDebuggerService) {
      /* It would sometimes trigger ExpressionHasChangedAfterItHasBeenCheckedError
      * Since this is only a developer tool it can stay as it is. */
      setTimeout(() => {
        viewHelperRefresherDebuggerService.register(this);
      });
    }

    refresher.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateSubjects());

    refresher.dataError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateSubjects());

    // fixme: child class cannot access its constructor variable inside a method,
    //  when that method was invoked in a base class constructor.
    //  This is a 'temporary' solution and fixed in the newer version of typescript
    setTimeout(() => {
      this.updateSubjects();
    });
  }

  ngOnDestroy(): void {
    if (this.viewHelperRefresherDebuggerService) {
      this.viewHelperRefresherDebuggerService.unregister(this);
    }
  }

  protected updateSubjects(): void {
    this._displayContentView$.next(this.shouldDisplayContentView());
    this._displayEmptyView$.next(this.shouldDisplayEmptyView());
    this._displayLoaderView$.next(this.shouldDisplayLoaderView());
    this._displayErrorView$.next(this.shouldDisplayErrorView());
  }

  get displayContentView() {
    return this._displayContentView$.value;
  }

  get displayEmptyView() {
    return this._displayEmptyView$.value;
  }

  get displayLoaderView() {
    return this._displayLoaderView$.value;
  }

  get displayErrorView() {
    return this._displayErrorView$.value;
  }

  protected abstract shouldDisplayContentView(): boolean;

  protected abstract shouldDisplayEmptyView(): boolean;

  protected abstract shouldDisplayLoaderView(): boolean;

  protected abstract shouldDisplayErrorView(): boolean;
}
