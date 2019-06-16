import { Refresher } from '../refresher';

export abstract class PageableRefresher<SourceData, ParsedData = SourceData> extends Refresher<SourceData, ParsedData[]> {
  abstract get totalItemsCount(): number;

  abstract get itemsCount(): number;

  abstract get pageNumber(): number;

  abstract get pageSize(): number;

  abstract get sort(): string;

  abstract get searchQuery(): string;

  abstract nextPage(): void;

  abstract previousPage(): void;

  abstract page(pageNumber: number, pageSize: number, sort?: string);

  abstract search(searchQuery: string);

  abstract searchQueryFn(item: ParsedData, searchQuery: string): boolean;

  abstract firstPage(): void;

  abstract lastPage(): void;
}
