import { wrapIntoObservable } from './rxjs';
import { of } from 'rxjs';

describe('rxjs', () => {

  describe('wrapIntoObservable', () => {

    it('should wrap plain object into observable', done => {
      const result = wrapIntoObservable(123);

      result.subscribe(value => {
        expect(value).toBe(123);
        done();
      });
    });

    it('should wrap promise into observable', done => {
      const result = wrapIntoObservable(Promise.resolve('abc'));

      result.subscribe(value => {
        expect(value).toBe('abc');
        done();
      });
    });

    it('should return the same observable when providing an observable', done => {
      const result = wrapIntoObservable(of(3.2));

      result.subscribe(value => {
        expect(value).toBe(3.2);
        done();
      });
    });

  });

});
