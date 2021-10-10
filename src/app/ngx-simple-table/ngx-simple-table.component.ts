import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { NgxFixedScrollbarComponent } from './ngx-fixed-scrollbar.component';
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
export class NgxSimpleTableComponent implements AfterViewInit {
  @Input() config: INgxSimpleTableConfig = {
    virtualScroll: false,
    tableClass: '',
    columns: [],
  };
  @Input('data') set setData(data: Array<any>) {
    this.data = data;
    this.markAllChecked();
  }

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
  @Output('onSort') _onChecked = new EventEmitter();

  public data: Array<any> = [];
  public pageChecked: boolean = false;
  public isAllItemsChecked: boolean = false;

  public tableChecked: INgxSimpleTableChecked = {
    isCheckAll: false,
    itemsChecked: [],
    itemsRemoved: [],
    indeterminate: false,
  };

  public totalRecord: number = 0;
  public currentPage: number = 1;
  public pageSize: number = 10;

  public sort = {
    key: '',
    descending: false,
  };
  public SORT_PARAM = SORT_PARAM;

  @ViewChildren('columnRef') columnRef: QueryList<ElementRef>;
  @ViewChild('fixedHeaderWrapperRef') fixedHeaderWrapperRef: ElementRef;
  @ViewChildren('fixedColumnHeaderRef')
  fixedColumnHeaderRef: QueryList<ElementRef>;
  @ViewChild('tableRef') tableRef: ElementRef;
  @ViewChild('fixedHeaderInnerRef') fixedHeaderInnerRef: ElementRef;
  @ViewChild('ngxFixedScrollbar') ngxFixedScrollbar: NgxFixedScrollbarComponent;

  constructor() {}

  ngAfterViewInit() {}

  @HostListener('document:scroll', ['$event'])
  public onWindowScroll(event: any) {
    const tableElement = this.tableRef.nativeElement as HTMLTableElement;
    // scrollbar wrapper
    const contentBottomEdge =
      tableElement.offsetTop + tableElement.offsetHeight;
    const tableRect = tableElement.getBoundingClientRect();
    // case 1: viewport's top edge is scrolled over element's top edge
    if (tableRect.y > 0) {
      this.stopFixedHeader();
      return;
    }
    // case 2: viewport's bottom edge touched element's bottom edge
    // case 2: viewport's bottom edge touched element's bottom edge
    if (window.scrollY >= contentBottomEdge) {
      this.stopFixedHeader();
      return;
    }
    this.startFixedHeader();
  }

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
    this.emitChangeTableChecked();
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
    this.emitChangeTableChecked();
  }

  public onClearAll() {
    this.isAllItemsChecked = false;
    this.resetTableSelected();
    this.markAllChecked();
    this.emitChangeTableChecked();
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
    this.sort.key = column;
    if (!this.sort.key) {
      this.sort.descending = false;
      return;
    }
    this.sort.descending = !this.sort.descending;
    this._onSort.emit(this.sort);
  }

  public startFixedHeader() {
    this.visibleFixedHeader(true);
    this.fitSizeFixedHeader();
  }

  public stopFixedHeader() {
    this.visibleFixedHeader(false);
  }

  public visibleFixedHeader(show: boolean) {
    const fixedHeaderWrapper = this.fixedHeaderWrapperRef
      .nativeElement as HTMLDivElement;
    if (!fixedHeaderWrapper) return;
    fixedHeaderWrapper.style.setProperty('display', show ? 'flex' : 'none');
  }

  public fitSizeFixedHeader() {
    const contentWidth =
      this.ngxFixedScrollbar.contentRef.nativeElement.offsetWidth;
    const fixedHeaderWrapper = this.fixedHeaderWrapperRef
      .nativeElement as HTMLDivElement;
    const tableElement = this.tableRef.nativeElement as HTMLDivElement;
    const fixedHeaderInner = this.fixedHeaderInnerRef
      .nativeElement as HTMLDivElement;
    fixedHeaderInner.style.setProperty(
      'width',
      tableElement.offsetWidth + 'px'
    );
    fixedHeaderWrapper.style.setProperty('width', contentWidth + 'px');
    const columnElements = this.columnRef.map((c) => c.nativeElement);
    columnElements.forEach((columnElement: HTMLElement, index: number) => {
      const columnComputedStyle = window.getComputedStyle(columnElement);
      const fixedHeaderColumnRef = this.fixedColumnHeaderRef.toArray()[index];
      const fixedHeaderColumn =
        fixedHeaderColumnRef.nativeElement as HTMLDivElement;
      fixedHeaderColumn.style.setProperty('width', columnComputedStyle.width);
      fixedHeaderColumn.style.setProperty('height', columnComputedStyle.height);
      fixedHeaderColumn.style.setProperty(
        'border-left',
        columnComputedStyle.borderLeft
      );
      fixedHeaderColumn.style.setProperty(
        'border-top',
        columnComputedStyle.borderTop
      );
      fixedHeaderColumn.style.setProperty(
        'border-bottom',
        columnComputedStyle.borderBottom
      );
      fixedHeaderColumn.style.setProperty(
        'font-weight',
        columnComputedStyle.fontWeight
      );
      fixedHeaderColumn.style.setProperty(
        'text-align',
        columnComputedStyle.textAlign
      );
      fixedHeaderColumn.style.setProperty(
        'padding',
        columnComputedStyle.padding
      );
      if (index === columnElements.length - 1) {
        fixedHeaderColumn.style.setProperty(
          'border-right',
          columnComputedStyle.borderRight
        );
      }
    });
  }

  public onScrollX(scrollLeft: number) {
    const fixedHeaderWrapper = this.fixedHeaderWrapperRef
      .nativeElement as HTMLDivElement;
    fixedHeaderWrapper.scrollLeft = scrollLeft;
  }

  public emitChangeTableChecked() {
    const tableChecked = { ...this.tableChecked };
    if (this.isAllItemsChecked) {
      tableChecked.isCheckAll = true;
      tableChecked.indeterminate = !!this.tableChecked.itemsRemoved.length;
    }
    this._onChecked.emit({
      ...tableChecked,
    });
  }
}
