import { from, Observable, of, OperatorFunction } from 'rxjs';
import { isPromise } from './is';
import { repeatWhen, switchMap } from 'rxjs/operators';

export function wrapIntoObservable<T>(value: T | Promise<T> | Observable<T>): Observable<T> {
  if (value instanceof Observable) {
    return value;
  }

  if (isPromise(value)) {
    return from(Promise.resolve(value));
  }

  return of(value as T);
}

/**
 * Reemits stream's last item when {notifier} emits a value.
 * @param notifier triggers data to be reemitted.
 */
export function reemitWhen<T>(notifier: Observable<any>): OperatorFunction<T, T> {
  return switchMap(it => of(it)
    .pipe(repeatWhen(() => notifier))
  );
}
