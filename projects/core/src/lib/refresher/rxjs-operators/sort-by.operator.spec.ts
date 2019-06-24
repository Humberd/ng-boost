import { sortArray } from './sort-by.operator';

describe('sortBy', () => {

  describe('sortArray', () => {

    describe('strings', () => {

      it('should sort ascending', () => {
        const arr = [
          {id: 'Aaa'},
          {id: 'Ccc'},
          {id: 'Bbb'}
        ];

        const result = sortArray(arr, 'id', true);

        expect(result).toEqual([
          {id: 'Aaa'},
          {id: 'Bbb'},
          {id: 'Ccc'}
        ]);
      });

      it('should sort descending', () => {
        const arr = [
          {id: 'Aaa'},
          {id: 'Ccc'},
          {id: 'Bbb'}
        ];

        const result = sortArray(arr, 'id', false);

        expect(result).toEqual([
          {id: 'Ccc'},
          {id: 'Bbb'},
          {id: 'Aaa'}
        ]);
      });

    });

    describe('numbers', () => {

      it('should sort ascending', () => {
        const arr = [
          {id: 1},
          {id: 3},
          {id: 2}
        ];

        const result = sortArray(arr, 'id', true);

        expect(result).toEqual([
          {id: 1},
          {id: 2},
          {id: 3}
        ]);
      });

      it('should sort descending', () => {
        const arr = [
          {id: 1},
          {id: 3},
          {id: 2}
        ];

        const result = sortArray(arr, 'id', false);

        expect(result).toEqual([
          {id: 3},
          {id: 2},
          {id: 1}
        ]);
      });

    });

    it('should not sort when sortKey is falsy', () => {
      const arr = [
        {id: 'Aaa'},
        {id: 'Ccc'},
        {id: 'Bbb'}
      ];

      const result = sortArray(arr, null, false);

      expect(result).toEqual([
        {id: 'Aaa'},
        {id: 'Ccc'},
        {id: 'Bbb'}
      ]);
      expect(result).not.toBe(arr);
    });

    it('should create new array instead of updating', () => {
      const arr = [
        {id: 'Aaa'},
        {id: 'Ccc'},
        {id: 'Bbb'}
      ];

      const result = sortArray(arr, 'id', false);

      expect(result).not.toBe(arr);
    });

  });

});
