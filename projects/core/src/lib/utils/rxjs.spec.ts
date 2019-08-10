import { reemitWhen, wrapIntoObservable } from './rxjs';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { skip } from 'rxjs/operators';

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

  describe('reemitWhen', () => {

    it('should reemit data', () => {
      const eventEmitter = new Subject();

      const dataStream = new Subject();

      let emittedData: any;
      dataStream
        .pipe(reemitWhen(eventEmitter))
        .subscribe(value => emittedData = value);

      dataStream.next('abc');
      expect(emittedData).toBe('abc');

      dataStream.next('def');
      expect(emittedData).toBe('def');
      emittedData = null;

      eventEmitter.next('event-data'); // <--- triggerint reemit
      expect(emittedData).toBe('def');

      dataStream.next('ghi');
      expect(emittedData).toBe('ghi');

    });

    it('should not throw any errors when emitter is a BehaviorSubject', () => {
      const eventEmitter = new BehaviorSubject('foobar');

      const dataStream = new Subject();

      let emittedData: any;
      dataStream
        .pipe(reemitWhen(eventEmitter.pipe(skip(1))))
        .subscribe(value => emittedData = value);

      dataStream.next('abc');
      expect(emittedData).toBe('abc');

      dataStream.next('def');
      expect(emittedData).toBe('def');
      emittedData = null;

      eventEmitter.next('event-data'); // <--- triggerint reemit
      expect(emittedData).toBe('def');

      dataStream.next('ghi');
      expect(emittedData).toBe('ghi');
    });

  });

});
