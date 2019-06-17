import { isObject, isPromise } from './is';

describe('is', () => {

  describe('isObject', () => {
    it('should pass assertions', () => {
      expect(isObject({})).toBe(true);
      expect(isObject(new Error())).toBe(true);

      expect(isObject([])).toBe(false);
      expect(isObject('')).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject(null)).toBe(false);
      expect(isObject(0)).toBe(false);
      expect(isObject(1.23)).toBe(false);
    });
  });

  describe('isPromise', () => {
    it('should pass assertions', () => {
      expect(isPromise(new Promise((resolve, reject) => {
      }))).toBe(true);

      expect(isPromise(Promise.resolve())).toBe(true);
      expect(isPromise(Promise.reject())).toBe(true);

      expect(isPromise({})).toBe(false);
      expect(isPromise([])).toBe(false);
      expect(isPromise('')).toBe(false);
      expect(isPromise(undefined)).toBe(false);
      expect(isPromise(null)).toBe(false);
      expect(isPromise(0)).toBe(false);
      expect(isPromise(1.23)).toBe(false);
    });
  });

});
