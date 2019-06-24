import { map } from 'rxjs/operators';
import { OperatorFunction } from 'rxjs';

export const sortBy = <T>(sortKeyFn: () => string): OperatorFunction<T[], T[]> => {
  return map(it => {
    const sort = sortKeyFn();

    return sortArray(it, keyFromSortKey(sort) as keyof T, isAscending(sort));
  });
};

export const isAscending = (sortKey: string) => sortKey.startsWith('+');
export const keyFromSortKey = (sortKey: string) => {
  if (!sortKey) {
    return '';
  }
  return sortKey.slice(1);
};

export function sortArray<T>(arr: T[], sortKey: keyof T, ascending: boolean): T[] {
  const newArr = [...arr];
  if (!sortKey) {
    return newArr;
  }


  return newArr.sort((a, b) => {
    const aValue: any = a[sortKey];
    const bValue: any = b[sortKey];

    let resultValue: number;
    if (isNumber(aValue) && isNumber(bValue)) {
      resultValue = aValue - bValue;
    } else {
      resultValue = String(aValue).localeCompare(String(bValue));
    }

    if (!ascending) {
      resultValue = -resultValue;
    }

    return resultValue;
  });
}

function isNumber(value: any): boolean {
  return typeof value === 'number';
}
