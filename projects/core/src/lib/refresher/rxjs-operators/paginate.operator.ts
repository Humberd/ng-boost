import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export const paginate = <T>(
  pageNumberFn: () => number,
  pageSizeFn: () => number
): OperatorFunction<T[], T[]> => {
  return map(it => paginateArray(it, pageNumberFn(), pageSizeFn()));
};

export function paginateArray<T>(arr: T[], pageNumber: number, pageSize: number): T[] {
  const totalPages = Math.ceil(arr.length / pageSize);

  let currentPageIndex: number;
  // ensure current page isn't out of range
  if (pageNumber < 1) {
    currentPageIndex = 0;
  } else if (pageNumber > totalPages) {
    currentPageIndex = totalPages - 1;
  } else {
    currentPageIndex = pageNumber;
  }

  return arr.slice(currentPageIndex * pageSize, (currentPageIndex + 1) * pageSize);
}
