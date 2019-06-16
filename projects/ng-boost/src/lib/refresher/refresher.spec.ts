import { Refresher } from './refresher';
import { Observable, of, throwError } from 'rxjs';
import { delay, flatMap, map } from 'rxjs/operators';
import { fakeAsync, tick } from '@angular/core/testing';
import { AutorefreshMode } from './autorefresh';

class TestRefresher extends Refresher<number, number> {
  constructor(private source: Observable<number> | Refresher<number, number>, period: number) {
    super({
      mode: AutorefreshMode.CONSTANT,
      period
    });
  }

  protected getDataSource(): Observable<number> | Refresher<number, number> {
    return this.source;
  }

  protected parseData(response: number): number {
    return response;
  }

  onSuccess(success: number): void {
    super.onSuccess(success);
  }

  onError(err: any): void {
    super.onError(err);
  }
}

describe('Refresher', () => {
  describe('ngOnInit', () => {
    it('should start autorefresh with 2 seconds period', fakeAsync(() => {
      let counter = 0;
      const emitter = of(null).pipe(map(() => ++counter));
      const refresher = new TestRefresher(emitter, 2000);

      refresher.ngOnInit();

      tick(1);
      expect(counter).toBe(1);

      tick(1998);
      expect(counter).toBe(1);

      tick(1);
      expect(counter).toBe(2);

      tick(2000);
      expect(counter).toBe(3);

      tick(2000);
      expect(counter).toBe(4);

      refresher.ngOnDestroy();
    }));

    it('should set isLoading to true before every refresh', fakeAsync(() => {
      let counter = 0;
      const emitter = of(null)
        .pipe(
          delay(10),
          map(() => ++counter)
        );
      const refresher = new TestRefresher(emitter, 2000);

      refresher.ngOnInit();

      expect(refresher.isLoading).toBe(true);

      /* Initial 10 sec delay */
      tick(9);
      expect(counter).toBe(0);
      expect(refresher.isLoading).toBe(true);

      tick(1);
      expect(counter).toBe(1);
      expect(refresher.isLoading).toBe(false);

      tick(1989);
      expect(refresher.isLoading).toBe(false);

      /* next delay starts after 1990 ms after previous delay, because timer doesn't wait for delay to end */
      tick(1);
      expect(refresher.isLoading).toBe(true);

      tick(10);
      expect(refresher.isLoading).toBe(false);
      expect(counter).toBe(2);

      refresher.ngOnDestroy();
    }));

    it('should init with default state', fakeAsync(() => {
      const refresher = new TestRefresher(of(1), 2000);

      refresher.ngOnInit();

      expect(refresher.isLoading).toBe(true);
      expect(refresher.isError).toBe(false);
      expect(refresher.isInitialized).toBe(false);

      refresher.ngOnDestroy();
    }));

    it('should invoke onSuccess and onError when dataSource is a Stream', fakeAsync(() => {
      const responses = [of(1234), throwError('calc-error'), of(5678)];
      const emitter = of(null).pipe(flatMap(() => responses.shift()));
      const refresher = new TestRefresher(emitter, 2000);

      spyOn(refresher, 'onSuccess').and.callThrough();
      spyOn(refresher, 'onError').and.callThrough();

      refresher.ngOnInit();

      tick(0);
      expect(refresher.onSuccess).toHaveBeenCalledWith(1234);

      tick(2000);
      expect(refresher.onError).toHaveBeenCalledWith('calc-error');

      tick(2000);
      expect(refresher.onSuccess).toHaveBeenCalledWith(5678);

      refresher.ngOnDestroy();
    }));

    it('should invoke onSuccess and onError when dataSource is another Refresher', fakeAsync(() => {
      const responses = [of(1234), throwError('calc-error'), of(5678)];
      const emitter = of(null).pipe(flatMap(() => responses.shift()));
      const otherRefresher = new TestRefresher(emitter, 2000);

      const refresher = new TestRefresher(otherRefresher, 2000);

      spyOn(refresher, 'onSuccess').and.callThrough();
      spyOn(refresher, 'onError').and.callThrough();

      otherRefresher.ngOnInit();
      refresher.ngOnInit();

      tick(0);
      expect(refresher.onSuccess).toHaveBeenCalledWith(1234);

      tick(2000);
      expect(refresher.onError).toHaveBeenCalledWith('calc-error');

      tick(2000);
      expect(refresher.onSuccess).toHaveBeenCalledWith(5678);

      refresher.ngOnDestroy();
      otherRefresher.ngOnDestroy();
    }));
  });

  describe('ngOnDestroy', () => {
    it('should clear all subscriptions', fakeAsync(() => {
      let counter = 0;
      const emitter = of(null).pipe(map(() => ++counter));
      const refresher = new TestRefresher(emitter, 2000);

      refresher.ngOnInit();

      tick(0);
      expect(counter).toBe(1);

      tick(2000);
      expect(counter).toBe(2);

      tick(2000);
      expect(counter).toBe(3);

      refresher.ngOnDestroy();
      /* tslint:disable:no-string-literal */
      expect(refresher['_data$'].isStopped).toBe(true);
      expect(refresher['_dataError$'].isStopped).toBe(true);
      expect(refresher['_isInitialized$'].isStopped).toBe(true);
      expect(refresher['_isError$'].isStopped).toBe(true);
      expect(refresher['_isLoading$'].isStopped).toBe(true);
      /* tslint:enable:no-string-literal */

      tick(2000);
      expect(counter).toBe(3);

      tick(2000);
      expect(counter).toBe(3);
    }));
  });


  describe('onError', () => {
    it('should set appropriate flags', fakeAsync(() => {
      const refresher = new TestRefresher(throwError('test-error'), 2000);

      refresher.ngOnInit();

      tick(1);
      expect(refresher.isLoading).toBe(false);
      expect(refresher.isError).toBe(true);
      expect(refresher.isInitialized).toBe(false);
      expect(refresher.dataError).toBe('test-error');
      expect(refresher.data).toBe(undefined);

      refresher.ngOnDestroy();
    }));
  });

  describe('onSuccess', () => {
    it('should set appropriate flags', fakeAsync(() => {
      const refresher = new TestRefresher(of(1234), 2000);

      refresher.ngOnInit();

      tick(1);
      expect(refresher.isLoading).toBe(false);
      expect(refresher.isError).toBe(false);
      expect(refresher.isInitialized).toBe(true);
      expect(refresher.dataError).toBe(undefined);
      expect(refresher.data).toBe(1234);

      refresher.ngOnDestroy();
    }));
  });

});

