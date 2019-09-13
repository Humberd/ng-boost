import { of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { autorefresh, AutorefreshMode } from './autorefresh';
import { fakeAsync, tick } from '@angular/core/testing';

describe('AutorefreshConsumerImpl', () => {

  describe('CONSTANT mode', () => {
    it('should autorefresh every 1 second', fakeAsync(() => {
      let received = null;
      const obs = of('foo')
        .pipe(
          tap(it => received = it)
        );
      const consumer = autorefresh({
        source: () => obs,
        period: 1000,
        mode: AutorefreshMode.CONSTANT
      });

      expect(received).toBe(null);

      tick(1);
      expect(received).toBe('foo');
      received = null;

      tick(998);
      expect(received).toBe(null);
      tick(1);
      expect(received).toBe('foo');
      received = null;

      tick(999);
      expect(received).toBe(null);
      tick(1);
      expect(received).toBe('foo');

      consumer.stop();
    }));

    it('should autorefresh every 1 second with async request', fakeAsync(() => {
      let received = null;
      const obs = of('foo')
        .pipe(
          delay(400),
          tap(it => received = it)
        );
      const consumer = autorefresh({
        source: () => obs,
        period: 1000,
        mode: AutorefreshMode.CONSTANT
      });

      expect(received).toBe(null);

      tick(399);
      expect(received).toBe(null);
      tick(1);
      expect(received).toBe('foo');
      received = null;

      tick(999);
      expect(received).toBe(null);
      tick(1);
      expect(received).toBe('foo');
      received = null;

      tick(999);
      expect(received).toBe(null);
      tick(1);
      expect(received).toBe('foo');

      consumer.stop();
    }));

    it('should reset autorefreseh timer when manual fetch occurs', fakeAsync(() => {
      let received = null;
      const obs = of('foo')
        .pipe(
          tap(it => received = it)
        );
      const consumer = autorefresh({
        source: () => obs,
        period: 1000,
        mode: AutorefreshMode.CONSTANT
      });

      tick(1500);
      expect(received).toBe('foo');
      received = null;

      consumer.fetch();
      tick(1);
      expect(received).toBe('foo');
      received = null;

      tick(998);
      expect(received).toBe(null);
      tick(1);
      expect(received).toBe('foo');

      consumer.stop();
    }));
  });

  describe('SOURCE_DEPENDANT mode', () => {
    it('should autorefresh every 1 second', fakeAsync(() => {
      let received = null;
      const obs = of('foo')
        .pipe(
          tap(it => received = it)
        );
      const consumer = autorefresh({
        source: () => obs,
        period: 1000,
        mode: AutorefreshMode.COUNT_AFTER_PREVIOUS_ENDS
      });

      expect(received).toBe('foo');
      received = null;

      tick(999);
      expect(received).toBe(null);
      tick(1);
      expect(received).toBe('foo');
      received = null;

      tick(999);
      expect(received).toBe(null);
      tick(1);
      expect(received).toBe('foo');

      consumer.stop();
    }));

    it('should autorefresh every 1 second after callback completes', fakeAsync(() => {
      let received = null;
      const obs = of('foo')
        .pipe(
          delay(500),
          tap(it => received = it)
        );
      const consumer = autorefresh({
        source: () => obs,
        period: 1000,
        mode: AutorefreshMode.COUNT_AFTER_PREVIOUS_ENDS
      });

      tick(1);
      expect(received).toBe(null);

      tick(499);
      expect(received).toBe('foo');
      received = null;

      tick(1499);
      expect(received).toBe(null);
      tick(1);
      expect(received).toBe('foo');
      received = null;

      tick(1499);
      expect(received).toBe(null);
      tick(1);
      expect(received).toBe('foo');

      consumer.stop();
    }));

    it('should reset autorefreseh timer when manual fetch occurs', fakeAsync(() => {
      let received = null;
      const obs = of('foo')
        .pipe(
          tap(it => received = it)
        );
      const consumer = autorefresh({
        source: () => obs,
        period: 1000,
        mode: AutorefreshMode.COUNT_AFTER_PREVIOUS_ENDS
      });

      tick(1500);
      expect(received).toBe('foo');
      received = null;

      consumer.fetch();
      expect(received).toBe('foo');
      received = null;

      tick(999);
      expect(received).toBe(null);
      tick(1);
      expect(received).toBe('foo');

      consumer.stop();
    }));

    it('should reset autorefreseh timer when manual fetch occurs after callback completes', fakeAsync(() => {
      let received = null;
      const obs = of('foo')
        .pipe(
          delay(500),
          tap(it => received = it)
        );
      const consumer = autorefresh({
        source: () => obs,
        period: 1000,
        mode: AutorefreshMode.COUNT_AFTER_PREVIOUS_ENDS
      });

      tick(1500);
      expect(received).toBe('foo');
      received = null;

      consumer.fetch();
      tick(499);
      expect(received).toBe(null);
      tick(1);
      expect(received).toBe('foo');
      received = null;

      tick(1499);
      expect(received).toBe(null);
      tick(1);
      expect(received).toBe('foo');

      consumer.stop();
    }));
  });

});
