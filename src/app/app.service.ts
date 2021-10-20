import { Injectable } from '@angular/core';
import { of } from 'rxjs';

const FAKE_DATA: any = [];
const TOTAL_RECORD = 23;

for (let i = 1; i <= TOTAL_RECORD; i++) {
  const age = Math.round(Math.random() * 10);
  FAKE_DATA.push({
    id: i,
    name: 'Sample ' + i,
    age: age,
  });
}

@Injectable()
export class AppService {
  constructor() {}

  public getData(params: any) {
    return of({
      status: true,
      data: this.paging(FAKE_DATA, params),
      totalRecord: TOTAL_RECORD,
    });
  }

  private paging(
    list: Array<any>,
    config: { pageSize: number; currentPage: number }
  ) {
    return list.slice(
      (config.currentPage - 1) * config.pageSize,
      config.currentPage * config.pageSize
    );
  }
}
