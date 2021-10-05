import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  INgxSimpleTableChecked,
  INgxSimpleTableConfig,
} from './ngx-simple-table.interface';

enum SORT_PARAM {
  ASC = 'asc',
  DESC = 'desc',
}

@Component({
  selector: 'ngx-simple-table',
  templateUrl: './ngx-simple-table.component.html',
  styleUrls: ['./ngx-simple-table.component.scss'],
})
export class NgxSimpleTableComponent {
  @Input() config: INgxSimpleTableConfig = {
    virtualScroll: false,
    tableClass: '',
    columns: [],
  };
  @Input('data') set setData(data: Array<any>) {
    this.data = data;
    this.markAllChecked();
  }
  @Input() tableChecked: INgxSimpleTableChecked = {
    isCheckAll: false,
    itemsChecked: [],
    itemsRemoved: [],
    indeterminate: false,
  };
  @Input('totalRecord') set setTotalRecord(totalRecord: number) {
    this.totalRecord = totalRecord;
  }
  @Input('currentPage') set setCurrentPage(currentPage: number) {
    this.currentPage = currentPage;
  }
  @Input('pageSize') set setPageSize(pageSize: number) {
    this.pageSize = pageSize;
  }
  @Output('onChangePaginator') _onChangePaginator = new EventEmitter();
  @Output('onSort') _onSort = new EventEmitter();

  public data: Array<any> = [];
  public pageChecked: boolean = false;
  public isAllItemsChecked: boolean = false;

  public totalRecord: number = 0;
  public currentPage: number = 1;
  public pageSize: number = 10;

  public sort = {};
  public SORT_PARAM = SORT_PARAM;

  constructor() {}

  public onCheckAll(checked: boolean) {
    // check all of a page
    this.data.forEach((item) => {
      this.onCheckItem({ id: item.id, checked: checked });
    });
  }

  public onCheckItem(data: { id: any; checked: boolean }): void {
    if (this.isAllItemsChecked) {
      this.pushToItemsRemoved(data);
    } else {
      this.pushToItemsChecked(data);
    }
    this.markAllChecked();
  }

  private pushToItemsChecked(data: { id: any; checked: boolean }) {
    const i = this.tableChecked.itemsChecked.indexOf(data.id);
    if (data.checked) {
      if (i === -1) {
        this.tableChecked.itemsChecked.push(data.id);
      }
    } else {
      if (i !== -1) {
        this.tableChecked.itemsChecked.splice(i, 1);
      }
    }
  }

  private pushToItemsRemoved(data: { id: any; checked: boolean }) {
    const i = this.tableChecked.itemsRemoved.indexOf(data.id);
    if (data.checked) {
      if (i !== -1) {
        this.tableChecked.itemsRemoved.splice(i, 1);
      }
    } else {
      if (i === -1) {
        this.tableChecked.itemsRemoved.push(data.id);
      }
    }
  }

  public markAllChecked() {
    const itemsPerPage: Array<any> = this.data.map((item) => item.id);
    const itemsChecked = this.tableChecked.itemsChecked.filter((id: string) => {
      return itemsPerPage.indexOf(id) !== -1;
    });
    if (this.isAllItemsChecked) {
      const itemsRemoved = this.tableChecked.itemsRemoved.filter(
        (id: string) => {
          return itemsPerPage.indexOf(id) !== -1;
        }
      );
      this.pageChecked =
        itemsPerPage.length > 0 && itemsRemoved.length === 0 ? true : false;
      return;
    }
    this.pageChecked =
      itemsChecked.length === itemsPerPage.length && itemsPerPage.length > 0;
  }

  public onChangePaginator(data: { currentPage: number; pageSize: number }) {
    this.markAllChecked();
    this._onChangePaginator.emit(data);
  }

  public isItemChecked(id: any) {
    if (this.isAllItemsChecked) {
      return this.tableChecked.itemsRemoved.indexOf(id) === -1;
    }
    return this.tableChecked.itemsChecked.indexOf(id) !== -1;
  }

  public onSelectAll() {
    this.isAllItemsChecked = true;
    this.resetTableSelected();
    this.markAllChecked();
  }

  public onClearAll() {
    this.isAllItemsChecked = false;
    this.resetTableSelected();
    this.markAllChecked();
  }

  public resetTableSelected() {
    this.tableChecked.itemsChecked = [];
    this.tableChecked.itemsRemoved = [];
    this.tableChecked.indeterminate = false;
  }

  public onStartSort(column: string) {
    if (this.sort[column]) return;
    this.sort[column] = SORT_PARAM.ASC;
  }

  public onSort(column: string) {
    if (!this.sort[column]) {
      this.sort[column] = SORT_PARAM.ASC;
      return;
    }
    this.sort[column] =
      this.sort[column] === SORT_PARAM.ASC ? SORT_PARAM.DESC : SORT_PARAM.ASC;
    this._onSort.emit(this.sort);
  }
}
