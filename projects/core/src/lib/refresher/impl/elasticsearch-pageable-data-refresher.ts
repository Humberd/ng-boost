import { ElasticsearchPage } from '../_models/elasticsearch-page';
import { PageableDataRefresher, PageOptions } from './pageable-data-refresher';
import { Refresher, RefresherConfig } from '../refresher';
import { AutorefreshMode } from '../autorefresh';
import { Observable } from 'rxjs';

// tslint:disable-next-line:max-line-length
export abstract class ElasticsearchPageableDataRefresher<SourceData, ParsedData = SourceData> extends PageableDataRefresher<ElasticsearchPage<SourceData>, ParsedData> {

  constructor(config: Partial<RefresherConfig> = {}) {
    super({
      period: 10_000,
      mode: AutorefreshMode.CONSTANT,
      ...config
    });
  }

  protected parseSourceData(sourceData: ElasticsearchPage<SourceData>): ParsedData[] {
    this.totalItemsCount = sourceData.totalElements;
    return sourceData.content as any as ParsedData[];
  }

}

interface Organization {
  id: number;
  name: string;
}

class OrganizationsRefresher extends ElasticsearchPageableDataRefresher<Organization> {
  protected getPageableDataSource(pageOptions: PageOptions): Observable<ElasticsearchPage<Organization>> | Refresher<any, ElasticsearchPage<Organization>> {
    return undefined;
  }

}
