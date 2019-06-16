export interface ElasticsearchPage<T> {
  content: T[];
  firstPage: boolean;
  lastPage: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  sort: string;
  totalElements: number;
  totalPages: number;
}
