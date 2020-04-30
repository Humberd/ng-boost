import { autorefresh, AutorefreshConsumer, AutorefreshMode } from './autorefresh';
import { OnDestroy } from '@angular/core';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';

export const NEVER_REFRESH = 999_999_000;

const NOT_INITIALIZED = undefined;
const EMPTY = null;

export type RefresherDataSource<SourceData> = Observable<SourceData> | Refresher<any, SourceData>;

/**
 * todo: change to Omit type
 * @see https://stackoverflow.com/a/48216010/4256929
 */
export interface RefresherConfig {
  period: number;
  mode: AutorefreshMode;
}

export abstract class Refresher<SourceData, ParsedData = SourceData> implements OnDestroy {
  protected readonly _data$ = new BehaviorSubject<ParsedData>(NOT_INITIALIZED);
  readonly data$: Observable<ParsedData> = this._data$.asObservable().pipe(filter(it => it !== NOT_INITIALIZED));

  get data(): ParsedData {
    return this._data$.value;
  }

  protected readonly _dataError$ = new BehaviorSubject<any>(NOT_INITIALIZED);
  readonly dataError$ = this._dataError$.asObservable().pipe(filter(it => it !== NOT_INITIALIZED));

  get dataError(): any {
    return this._dataError$.value;
  }

  protected readonly _isLoading$ = new BehaviorSubject<boolean>(false);
  readonly isLoading$ = this._isLoading$.asObservable();

  get isLoading() {
    return this._isLoading$.value;
  }

  set isLoading(isLoading: boolean) {
    this._isLoading$.next(isLoading);
  }

  protected readonly _isError$ = new BehaviorSubject<boolean>(false);
  readonly isError$ = this._isError$.asObservable();

  get isError() {
    return this._isError$.value;
  }

  protected readonly _isInitialized$ = new BehaviorSubject<boolean>(false);
  readonly isInitialized$ = this._isInitialized$.asObservable();

  get isInitialized() {
    return this._isInitialized$.value;
  }

  protected autorefreshConsumer: AutorefreshConsumer;

  constructor(private config: RefresherConfig) {
    this.initDefaultState();
  }

  /**
   * Have to call it manually in the component
   */
  start(): void {
    const dataSourceHandlers$ = this.applyDataSourceHandlers(this.getDataSource());

    const source = () => {
      this._isLoading$.next(true);

      return dataSourceHandlers$;
    };

    this.autorefreshConsumer = autorefresh({
      period: this.config.period,
      mode: this.config.mode,
      source,
    });
  }

  private applyDataSourceHandlers(dataSource: RefresherDataSource<SourceData>) {
    if (dataSource instanceof Refresher) {
      /* Data refresh is already being triggered on parent Refresher. We don't want to do it twice  */
      this.config.period = NEVER_REFRESH;

      const a = dataSource.data$
        .pipe(tap(it => this.handleSuccess(it)));

      const b = dataSource.dataError$
        .pipe(tap(it => this.handleError(it)));

      return merge(a, b);
    }

    return dataSource
      .pipe(
        tap({
          next: value => this.handleSuccess(value),
        }),
        catchError(err => {
          this.handleError(err);
          return of();
        })
      );
  }

  ngOnDestroy(): void {
    this.autorefreshConsumer.stop();
    this._data$.complete();
    this._dataError$.complete();
    this._isInitialized$.complete();
    this._isError$.complete();
    this._isLoading$.complete();
  }

  stop(): void {
    this.autorefreshConsumer.stop();
  }

  resume(): void {
    this.start();
  }

  restart(): void {
    this.stop();
    this.resume();
  }

  softRefresh(): void {
    this.autorefreshConsumer.fetch();
  }

  hardRefresh(): void {
    this.stop();
    this.start();
  }

  private initDefaultState() {
    this._isLoading$.next(true);
    this._isError$.next(false);
    this._isInitialized$.next(false);
  }

  private handleSuccess(success: SourceData): void {
    this._onSuccess(success);
    this.onSuccess(success);
  }

  private _onSuccess(success: SourceData): void {
    this._isLoading$.next(false);
    this._isError$.next(false);
    this._isInitialized$.next(true);
    this._data$.next(this.modifyData(this.parseSourceData(success)));
  }

  protected onSuccess(success: SourceData): void {
    // implemented by the user
  }

  private handleError(err: any): void {
    this._onError(err);
    this.onError(err);
  }

  private _onError(err: any): void {
    this._isLoading$.next(false);
    this._isError$.next(true);
    this._dataError$.next(err);
  }

  protected onError(err: any): void {
    console.error(err);
    // implemented by the user
  }

  protected abstract getDataSource(): RefresherDataSource<SourceData>;

  protected abstract parseSourceData(sourceData: SourceData): ParsedData;

  protected modifyData(parsedData: ParsedData): ParsedData {
    return parsedData;
  }

}
