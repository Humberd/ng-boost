import { PageableDataRefresher, PageOptions } from './pageable-data-refresher';
import { Refresher, RefresherConfig } from '../refresher';
import { AutorefreshMode } from '../autorefresh';
import { paginateArray } from '../rxjs-operators/paginate.operator';
import { isAscending, keyFromSortKey, sortArray } from '../rxjs-operators/sort-by.operator';
import { Observable } from 'rxjs';

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

interface Organization {
  id: number;
  name: string;
}

class OrganizationsRefresher extends ClientSidePageableDataRefresher<Organization> {
  protected getPageableDataSource(pageOptions: PageOptions): Observable<Organization> | Refresher<any, Organization> {
    return undefined;
  }

  searchFilterFn(item: Organization, searchQuery: string): boolean {
    return item.name === searchQuery;
  }

}
