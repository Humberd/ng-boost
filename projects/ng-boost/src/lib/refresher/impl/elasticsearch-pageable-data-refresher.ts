import { ElasticsearchPage } from '../_models/elasticsearch-page';
import { PageableDataRefresher } from './pageable-data-refresher';
import { RefresherConfig } from '../refresher';
import { AutorefreshMode } from '../autorefresh';

export abstract class ElasticsearchPageableDataRefresher<SourceData, ParsedData = SourceData> extends PageableDataRefresher<ElasticsearchPage<SourceData>, ParsedData> {
  private pageInfo: ElasticsearchPage<SourceData>;
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

  page(pageNumber: number, pageSize: number, sort?: string): void {
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
    this._pageNumber = this.pageInfo.totalPages - 1;
    this.refresh();
  }


// protected abstract loadItems(pageNumber: number, pageSize: number, sort?: string): Observable<ElasticsearchPage<Data>>;
  //
  // protected getDataSource(): Observable<ElasticsearchPage<Data>> {
  //   return this.loadItems(this.pageNumber, this.pageSize, this.sort);
  // }
}
