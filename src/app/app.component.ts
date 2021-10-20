import { Component, OnInit, VERSION } from '@angular/core';
import { AppService } from './app.service';
import {
  INgxSimpleTableChecked,
  INgxSimpleTableConfig,
  INgxSimpleTableIcon,
} from './ngx-simple-table/ngx-simple-table.interface';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
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

  constructor(private appService: AppService) {}

  ngOnInit() {
    setTimeout(() => {
      this.search();
    }, 1000);
  }

  public search() {
    this.appService
      .getData({ ...this.tableChecked, ...this.pagination })
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
}
