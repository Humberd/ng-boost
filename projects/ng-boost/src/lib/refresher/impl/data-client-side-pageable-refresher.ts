import { PageableRefresher } from './pageable-refresher';
import { RefresherConfig } from '../refresher';
import { AutorefreshMode } from '../autorefresh';
import { paginateArray } from '../rxjs-operators/paginate.operator';
import { isAscending, keyFromSortKey, sortArray } from '../rxjs-operators/sort-by.operator';

// tslint:disable-next-line:max-line-length
export abstract class DataClientSidePageableRefresher<SourceData, ParsedData = SourceData> extends PageableRefresher<SourceData, ParsedData> {
  private _pageNumber = 0;
  private _pageSize = 10;
  private _sort = '';
  private _totalItemsCount = 0;
  private _searchQuery = '';

  constructor(config: Partial<RefresherConfig> = {}) {
    super({
      period: 10_000,
      mode: AutorefreshMode.CONSTANT,
      ...config
    });
  }

  get totalItemsCount(): number {
    return this._totalItemsCount;
  }

  get itemsCount(): number {
    return this.data.length;
  }

  get pageNumber(): number {
    return this._pageNumber;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  get sort(): string {
    return this._sort;
  }

  get searchQuery(): string {
    return this._searchQuery;
  }

  nextPage(): void {
    this._pageNumber++;
    this.refresh();
  }

  previousPage(): void {
    this._pageNumber--;
    this.refresh();
  }

  page(pageNumber: number, pageSize: number, sort?: string) {
    this._pageNumber = pageNumber;
    this._pageSize = pageSize;
    this._sort = sort || '';
    console.log({pageNumber, pageSize, sort});
    this.refresh();
  }

  search(searchQuery: string) {
    this._searchQuery = searchQuery || '';
    console.log({searchQuery});
    this.refresh();
  }

  /**
   * Override this function if you want to search by custom field
   */
  searchQueryFn(item: ParsedData, searchQuery: string): boolean {
    return true;
  }

  firstPage(): void {
    this._pageNumber = 0;
    this.refresh();
  }

  lastPage(): void {
    this._pageNumber = Math.floor(this.data.length / this.pageSize) || 0;
    this.refresh();
  }

  protected paginateData(data: ParsedData[]): ParsedData[] {
    this._totalItemsCount = data.length;
    const filteredResponse = data.filter(value => this.searchQueryFn(value, this._searchQuery));
    const sortedResponse = sortArray(filteredResponse, keyFromSortKey(this.sort) as keyof ParsedData, isAscending(this.sort));
    return paginateArray(sortedResponse, this.pageNumber, this.pageSize);
  }

}

