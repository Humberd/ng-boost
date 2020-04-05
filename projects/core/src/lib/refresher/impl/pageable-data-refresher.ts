import { Refresher, RefresherConfig, RefresherDataSource } from '../refresher';

export interface PageOptions {
  pageNumber: number;
  pageSize: number;
  sort?: string;
  search?: string;
}

export abstract class PageableDataRefresher<SourceData, ParsedData = SourceData> extends Refresher<SourceData, ParsedData[]> {
  private _pageNumber: number;
  private _pageSize: number;
  private _sort: string;
  private _searchQuery: string;
  private _totalItemsCount = 0;

  constructor(refresherConfig: RefresherConfig, initialPage?: Partial<PageOptions>) {
    super(refresherConfig);

    initialPage = initialPage || {};
    this._pageNumber = initialPage.pageNumber || 0;
    this._pageSize = initialPage.pageSize || 10;
    this._sort = initialPage.sort || '';
    this._searchQuery = initialPage.search || '';

  }

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
    this.hardRefresh();
  }

  previousPage(): void {
    this._pageNumber--;
    this.hardRefresh();
  }

  firstPage(): void {
    this._pageNumber = 0;
    this.hardRefresh();
  }

  lastPage(): void {
    this._pageNumber = Math.floor(this.totalItemsCount / this.pageSize) || 0;
    this.hardRefresh();
  }

  page(pageNumber: number, pageSize: number, sort?: string) {
    this._pageNumber = pageNumber;
    this._pageSize = pageSize;
    this._sort = sort || '';
    console.log({pageNumber, pageSize, sort});
    this.hardRefresh();
  }

  search(searchQuery: string) {
    this._searchQuery = searchQuery || '';
    console.log({searchQuery});
    this.hardRefresh();
  }

  protected abstract getPageableDataSource(pageOptions: PageOptions): RefresherDataSource<SourceData>;

  protected getDataSource(): RefresherDataSource<SourceData> {
    return this.getPageableDataSource({
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sort: this.sort,
      search: this.searchQuery,
    });
  }

}
