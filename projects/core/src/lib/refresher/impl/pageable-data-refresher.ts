import { Refresher, RefresherDataSource } from '../refresher';

export interface PageOptions {
  pageNumber: number;
  pageSize: number;
  sort?: string;
  search?: string;
}

export abstract class PageableDataRefresher<SourceData, ParsedData = SourceData> extends Refresher<SourceData, ParsedData[]> {
  private _pageNumber = 0;
  private _pageSize = 10;
  private _sort = '';
  private _totalItemsCount = 0;
  private _searchQuery = '';

  get totalItemsCount(): number {
    return this._totalItemsCount;
  }

  set totalItemsCount(value: number) {
    this._totalItemsCount = value;
  }

  get itemsCount(): number {
    if (!this.data) {
      return 0;
    }
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

  firstPage(): void {
    this._pageNumber = 0;
    this.refresh();
  }

  lastPage(): void {
    this._pageNumber = Math.floor(this.totalItemsCount / this.pageSize) || 0;
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

  protected abstract getPageableDataSource(pageOptions: PageOptions): RefresherDataSource<SourceData>;

  protected getDataSource(): RefresherDataSource<SourceData> {
    return this.getPageableDataSource({
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sort: this.sort,
      search: this.searchQuery
    });
  }

}
