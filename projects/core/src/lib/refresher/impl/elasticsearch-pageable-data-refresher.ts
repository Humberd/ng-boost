import { ElasticsearchPage } from '../_models/elasticsearch-page';
import { PageableDataRefresher, PageOptions } from './pageable-data-refresher';
import { RefresherConfig } from '../refresher';
import { AutorefreshMode } from '../autorefresh';

// tslint:disable-next-line:max-line-length
export abstract class ElasticsearchPageableDataRefresher<SourceData, ParsedData = SourceData> extends PageableDataRefresher<ElasticsearchPage<SourceData>, ParsedData> {

  constructor(config: Partial<RefresherConfig> = {}, initialPage?: Partial<PageOptions>) {
    super({
      period: 10_000,
      mode: AutorefreshMode.COUNT_AFTER_PREVIOUS_ENDS,
      ...config
    }, initialPage);
  }

  protected parseSourceData(sourceData: ElasticsearchPage<SourceData>): ParsedData[] {
    this.totalItemsCount = sourceData.totalElements;
    return sourceData.content as any as ParsedData[];
  }

}
