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
export class DemoFixedColumnService {
  constructor() {}

  public getData(params: any) {
    this.sort(FAKE_DATA, params.key, params.descending);
    console.log(FAKE_DATA);
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

  private sort(list: Array<any>, key: string, descending: boolean) {
    list.sort((a: any, b: any) => {
      const isNumeric: boolean =
        typeof a[key] === 'number' || typeof b[key] === 'number' ? true : false;
      const valueA = '' + a[key];
      const valueB = '' + b[key];
      return descending
        ? valueB.localeCompare(valueA, undefined, { numeric: isNumeric })
        : valueA.localeCompare(valueB, undefined, { numeric: isNumeric });
    });
  }
}
