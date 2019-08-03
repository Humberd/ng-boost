import { PageableDataRefresher } from './pageable-data-refresher';
import { RefresherConfig } from '../refresher';
import { AutorefreshMode } from '../autorefresh';
import { paginateArray } from '../rxjs-operators/paginate.operator';
import { isAscending, keyFromSortKey, sortArray } from '../rxjs-operators/sort-by.operator';

// tslint:disable-next-line:max-line-length
export abstract class ClientSidePageableDataRefresher<SourceData, ParsedData = SourceData> extends PageableDataRefresher<SourceData, ParsedData> {

  constructor(config: Partial<RefresherConfig> = {}) {
    super({
      period: 10_000,
      mode: AutorefreshMode.CONSTANT,
      ...config
    });
  }

  abstract searchFilterFn(item: ParsedData, searchQuery: string): boolean;

  protected parseSourceData(response: SourceData): ParsedData[] {
    return response as any as ParsedData[];
  }

  protected modifyData(parsedData: ParsedData[]): ParsedData[] {
    this.totalItemsCount = parsedData.length;
    const filteredResponse = this.searchQuery ? parsedData.filter(value => this.searchFilterFn(value, this.searchQuery)) : parsedData;
    const sortedResponse = sortArray(filteredResponse, keyFromSortKey(this.sort) as keyof ParsedData, isAscending(this.sort));
    return paginateArray(sortedResponse, this.pageNumber, this.pageSize);
  }

}
