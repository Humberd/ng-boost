import { from, Observable, of } from 'rxjs';

function isPromise(value: any): boolean {
  return value && (typeof value.then === 'function');
}

export function wrapIntoObservable<T>(value: T | Promise<T> | Observable<T>): Observable<T> {

  if (value instanceof Observable) {
    return value;
  }

  if (isPromise(value)) {
    return from(Promise.resolve(value));
  }

  return of(value as T);
}

