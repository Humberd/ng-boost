import { isObject } from './is';

describe('is', () => {

  describe('isObject', () => {
    it('should pass assetions', () => {
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

});
