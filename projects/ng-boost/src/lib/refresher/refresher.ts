import { autorefresh, AutorefreshConsumer, AutorefreshMode } from './autorefresh';
import { OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

export const NEVER_REFRESH = 999_999_000;

const NOT_INITIALIZED = undefined;
const EMPTY = null;

export type RefresherSourceType<SourceData> = Observable<SourceData> | Refresher<any, SourceData>;

/**
 * todo: change to Omit type
 * @see https://stackoverflow.com/a/48216010/4256929
 */
export interface RefresherConfig {
  period: number;
  mode: AutorefreshMode;
}

export abstract class Refresher<SourceData, ParsedData = SourceData> implements OnDestroy, OnInit {
  private readonly _data$ = new BehaviorSubject<ParsedData>(NOT_INITIALIZED);
  readonly data$: Observable<ParsedData> = this._data$.asObservable().pipe(filter(it => it !== NOT_INITIALIZED));

  get data(): ParsedData {
    return this._data$.value;
  }

  private readonly _dataError$ = new BehaviorSubject<any>(NOT_INITIALIZED);
  readonly dataError$ = this._dataError$.asObservable().pipe(filter(it => it !== NOT_INITIALIZED));

  get dataError(): any {
    return this._dataError$.value;
  }

  private readonly _isLoading$ = new BehaviorSubject<boolean>(false);
  readonly isLoading$ = this._isLoading$.asObservable();

  get isLoading() {
    return this._isLoading$.value;
  }

  private readonly _isError$ = new BehaviorSubject<boolean>(false);
  readonly isError$ = this._isError$.asObservable();

  get isError() {
    return this._isError$.value;
  }

  private readonly _isInitialized$ = new BehaviorSubject<boolean>(false);
  readonly isInitialized$ = this._isInitialized$.asObservable();

  get isInitialized() {
    return this._isInitialized$.value;
  }

  protected autorefreshConsumer: AutorefreshConsumer;

  constructor(private config: RefresherConfig) {
  }

  /**
   * Have to call it manually in the component
   */
  ngOnInit(): void {
    this.initDefaultState();

    const dataSourceHandlers$ = this.applyDataSourceHandlers(this.getDataSource());

    const source = () => {
      this._isLoading$.next(true);

      return dataSourceHandlers$;
    };

    this.autorefreshConsumer = autorefresh({
      period: this.config.period,
      mode: this.config.mode,
      source
    });
    console.log('Autorefresh initiated');
  }

  private applyDataSourceHandlers(dataSource: RefresherSourceType<SourceData>) {
    if (dataSource instanceof Refresher) {
      /* Data refresh is already being triggered on parent Refresher. We don't want to do it twice  */
      this.config.period = NEVER_REFRESH;

      const a = dataSource.data$
        .pipe(tap(it => this.onSuccess(it)));

      const b = dataSource.dataError$
        .pipe(tap(it => this.onError(it)));

      console.log(`Applying data source: ${dataSource.constructor.name} -> ${this.constructor.name}`);
      return merge(a, b);
    }

    console.log(`Applying data source: Stream -> ${this.constructor.name}`);
    return dataSource
      .pipe(
        tap({
          next: value => this.onSuccess(value),
          error: err => this.handleError(err)
        })
      );
  }

  ngOnDestroy(): void {
    this.autorefreshConsumer.stop();
    console.log('Autorefresh destroyed');
    this._data$.complete();
    this._dataError$.complete();
    this._isInitialized$.complete();
    this._isError$.complete();
    this._isLoading$.complete();
  }

  stop(): void {
    this.autorefreshConsumer.stop();
    console.log('Refresher has been stopped.');
  }

  resume(): void {
    this.ngOnInit();
    console.log('Refresher has been resumed');
  }

  restart(): void {
    this.stop();
    this.resume();
  }

  refresh(): void {
    this.autorefreshConsumer.fetch();
    console.log('Refreshing manually');
  }

  private initDefaultState() {
    this._isLoading$.next(true);
    this._isError$.next(false);
    this._isInitialized$.next(false);
  }

  protected onSuccess(success: SourceData): void {
    this._isLoading$.next(false);
    this._isError$.next(false);
    this._isInitialized$.next(true);
    this._data$.next(this.parseData(success));
  }

  private handleError(err: any): void {
    if ((err instanceof HttpErrorResponse) && err.status === 404) {
      this.onSuccess(EMPTY);
      return;
    }

    this.onError(err);
  }

  protected onError(err: any): void {
    console.error(err);
    this._isLoading$.next(false);
    this._isError$.next(true);
    this._dataError$.next(err);
  }

  /**
   * Invoked only once during ngOnInit() phase or after manual reloadWithNewParams()
   */
  protected abstract getDataSource(): RefresherSourceType<SourceData>;

  protected abstract parseData(response: SourceData): ParsedData;

}
