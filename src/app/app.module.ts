import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import {
  INgxSimpleTableChecked,
  INgxSimpleTableConfig,
} from './ngx-simple-table/ngx-simple-table.interface';
import { AppService } from './app.service';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [AppService],
})
export class AppModule {
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
}
