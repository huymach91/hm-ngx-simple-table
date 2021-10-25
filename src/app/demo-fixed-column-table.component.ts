import { Component, OnInit, VERSION } from '@angular/core';
import { AppService } from './app.service';
import {
  INgxSimpleTableChecked,
  INgxSimpleTableConfig,
  INgxSimpleTableIcon,
} from './ngx-simple-table/ngx-simple-table.interface';

@Component({
  selector: 'demo-fixed-column-table',
  templateUrl: './demo-fixed-column-table.component.html',
  styleUrls: ['./demo-fixed-column-table.component.scss'],
})
export class DemoFixedColumnTableComponent implements OnInit {
  public fixedColumnTableConfig: INgxSimpleTableConfig = {
    tableClass: 'fixed-column-table table table-hovered',
    virtualScroll: false,
    columns: [
      {
        prop: 'id',
        title: 'ID',
        fixed: true,
      },
      {
        prop: 'name',
        title: 'Name',
        fixed: true,
      },
      {
        prop: 'age',
        title: 'Age',
      },
      {
        prop: 'birthDate',
        title: 'Birth Date',
      },
      {
        prop: 'grade',
        title: 'Grade',
      },
      {
        prop: 'math',
        title: 'Math',
      },
      {
        prop: 'physics',
        title: 'Physics',
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

  constructor(private appService: AppService) {}

  ngOnInit() {
    setTimeout(() => {
      this.search();
    }, 1000);
  }

  public search() {
    this.appService
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
