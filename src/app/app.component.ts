import { Component, OnInit, VERSION } from '@angular/core';
import { AppService } from './app.service';
import {
  INgxSimpleTableChecked,
  INgxSimpleTableConfig,
} from './ngx-simple-table/ngx-simple-table.interface';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public simpleTableConfig: INgxSimpleTableConfig = {
    tableClass: 'my-simple-table',
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
  public tableChecked: INgxSimpleTableChecked = {
    isCheckAll: false,
    itemsChecked: [],
    itemsRemoved: [],
    indeterminate: false,
  };
  public data = [];
  public pagination = {
    pageSize: 10,
    currentPage: 1,
    totalRecord: 0,
  };

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.search();
  }

  public search() {
    this.appService
      .getData({ ...this.tableChecked, ...this.pagination })
      .subscribe((resp: any) => {
        console.log(resp);
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
}
