import { paginateArray } from './paginate.operator';

describe('paginate', () => {

  describe('paginateArray', () => {

    it('should get the first page', () => {
      const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      const result = paginateArray(arr, 0, 4);

      expect(result).toEqual([0, 1, 2, 3]);
    });

    it('should get the second page', () => {
      const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      const result = paginateArray(arr, 1, 4);

      expect(result).toEqual([4, 5, 6, 7]);
    });

    it('should get the last page', () => {
      const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      const result = paginateArray(arr, 2, 4);

      expect(result).toEqual([8, 9, 10]);
    });

    it('should get the last page when pageNumber exceeds total pages available', () => {
      const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      const result = paginateArray(arr, 5, 4);

      expect(result).toEqual([8, 9, 10]);
    });

    it('should get the first page when pageNumber is less than 1', () => {
      const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      const result = paginateArray(arr, -20, 4);

      expect(result).toEqual([0, 1, 2, 3]);
    });

    it('should get the all items when pageSize exceeds total length', () => {
      const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      const result = paginateArray(arr, 0, 40);

      expect(result).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

  });

});
