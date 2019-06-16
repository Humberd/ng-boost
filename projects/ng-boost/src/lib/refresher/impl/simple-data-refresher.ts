import { Refresher, RefresherConfig } from '../refresher';
import { AutorefreshMode } from '../autorefresh';

export abstract class SimpleDataRefresher<SourceData, ParsedData = SourceData> extends Refresher<SourceData, ParsedData> {

  constructor(config: Partial<RefresherConfig> = {}) {
    super({
      period: 10_000,
      mode: AutorefreshMode.CONSTANT,
      ...config
    });
  }


  protected parseData(response: SourceData): ParsedData {
    return response as any as ParsedData;
  }
}
