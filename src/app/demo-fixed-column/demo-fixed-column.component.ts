import { Component, OnInit, VERSION } from '@angular/core';
import { DemoFixedColumnService } from './demo-fixed-column.service';
import {
  INgxSimpleTableChecked,
  INgxSimpleTableConfig,
  INgxSimpleTableIcon,
} from '../ngx-simple-table/ngx-simple-table.interface';

@Component({
  selector: 'demo-fixed-column',
  templateUrl: './demo-fixed-column.component.html',
  styleUrls: ['./demo-fixed-column.component.scss'],
})
export class DemoFixedColumnComponent implements OnInit {
  public simpleTableConfig: INgxSimpleTableConfig = {
    tableClass: 'my-simple-table table table-hovered',
    virtualScroll: false,
    columns: [
      {
        prop: 'id',
        title: 'ID',
      },
      {
        prop: 'name',
        title: 'Name',
      },
      {
        prop: 'age',
        title: 'Age',
      },
    ],
  };
  public icons: INgxSimpleTableIcon = {
    hamburger: 'bi bi-list',
    check: 'bi bi-check',
    sortAsc: 'bi bi-sort-down',
    sortDesc: 'bi bi-sort-up',
  };
  public data = [];
  public pagination = {
    pageSize: 100,
    currentPage: 1,
    totalRecord: 0,
  };
  public tableChecked: INgxSimpleTableChecked = {
    isCheckAll: false,
    itemsChecked: [],
    itemsRemoved: [],
    indeterminate: false,
  };
  public sort: any = {
    key: 'id',
    descending: false,
  };

  constructor(private demoFixedColumnService: DemoFixedColumnService) {}

  ngOnInit() {
    setTimeout(() => {
      this.search();
    }, 1000);
  }

  public search() {
    this.demoFixedColumnService
      .getData({ ...this.tableChecked, ...this.pagination, ...this.sort })
      .subscribe((resp: any) => {
        this.data = resp.data;
        this.pagination.totalRecord = resp.totalRecord;
      });
  }

  public onChangePaginator(
    data: { pageSize: number; currentPage: number } = {
      pageSize: 10,
      currentPage: 1,
    }
  ) {
    this.pagination.pageSize = data.pageSize;
    this.pagination.currentPage = data.currentPage;
    this.search();
  }

  public onChecked(tableChecked: any) {
    this.tableChecked = tableChecked;
  }

  public onSort(value: any) {
    this.sort = value;
    this.search();
  }
}
