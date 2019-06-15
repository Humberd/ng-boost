import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { autorefresh } from './autorefresh';
import { fakeAsync, tick } from '@angular/core/testing';

describe('AutorefreshConsumerImpl', () => {
  it('should autorefresh every 1 second', fakeAsync(() => {
    let received = null;
    const obs = of('foo')
      .pipe(
        tap(it => received = it)
      );
    const consumer = autorefresh(() => obs, 1000);

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

  it('should reset autorefreseh timer when manual fetch occurs', fakeAsync(() => {
    let received = null;
    const obs = of('foo')
      .pipe(
        tap(it => received = it)
      );
    const consumer = autorefresh(() => obs, 1000);

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
