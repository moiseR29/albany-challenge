export interface ResultQuery {
  rowCount: number;
  rows: Array<any>;
}

export interface Sql {
  query(query: string, values: any[]): Promise<ResultQuery>;
}
