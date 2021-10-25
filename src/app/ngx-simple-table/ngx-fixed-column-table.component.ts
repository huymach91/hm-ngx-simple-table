import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { NgxFixedScrollbarComponent } from './ngx-fixed-scrollbar.component';
import {
  INgxSimpleTableChecked,
  INgxSimpleTableColumn,
  INgxSimpleTableConfig,
  INgxSimpleTableIcon,
} from './ngx-simple-table.interface';

enum SORT_PARAM {
  ASC = 'asc',
  DESC = 'desc',
}

@Component({
  selector: 'ngx-fixed-column-table',
  templateUrl: './ngx-fixed-column-table.component.html',
  styleUrls: ['./ngx-simple-table.component.scss'],
})
export class NgxFixedColumnTableComponent implements OnInit, AfterViewInit {
  @Input() config: INgxSimpleTableConfig = {
    virtualScroll: false,
    tableClass: '',
    fixedHeaderClass: '',
    columns: [],
  };
  @Input('data') set setData(data: Array<any>) {
    this.data = data;
    this.markAllChecked();
  }
  @Input() icons: INgxSimpleTableIcon = {
    check: '',
    hamburger: '',
    sortAsc: '',
    sortDesc: '',
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
  @Output('onChecked') _onChecked = new EventEmitter();

  public data: Array<any> = [];
  public pageChecked: boolean = false;
  public isAllItemsChecked: boolean = false;
  public showColumnSelectorDropdown: boolean = false;

  public tableChecked: INgxSimpleTableChecked = {
    isCheckAll: false,
    itemsChecked: [],
    itemsRemoved: [],
    indeterminate: false,
  };

  public totalRecord: number = 0;
  public currentPage: number = 1;
  public pageSize: number = 10;

  public sort: any = {
    key: '',
    descending: false,
  };
  public SORT_PARAM = SORT_PARAM;

  public hideColumns = {};

  public scrollerStyle = {
    width: '',
    marginLeft: '',
  };
  private fixedColumns: Array<INgxSimpleTableColumn>;

  @ViewChildren('columnRef') columnRef: QueryList<ElementRef>;
  @ViewChildren('rowRef') rowRef: QueryList<ElementRef>;
  @ViewChild('fixedHeaderWrapperRef') fixedHeaderWrapperRef: ElementRef;
  @ViewChildren('fixedColumnHeaderRef')
  fixedColumnHeaderRef: QueryList<ElementRef>;
  @ViewChild('tableRef') tableRef: ElementRef;
  @ViewChild('fixedHeaderInnerRef') fixedHeaderInnerRef: ElementRef;
  @ViewChild('ngxFixedScrollbar') ngxFixedScrollbar: NgxFixedScrollbarComponent;
  @ViewChild('selectAllWrapperRef') selectAllWrapperRef: ElementRef;
  @ViewChild('columnSelectorRef') columnSelectorRef: ElementRef;
  @ViewChild('scrollerRef') scrollerRef: ElementRef;

  constructor() {}

  ngOnInit() {
    this.fixedColumns = this.config.columns.filter((column) => column?.fixed);
  }

  ngAfterViewInit() {
    this.columnRef.changes.subscribe(() => {
      const columns = this.columnRef.filter((columnRef) =>
        (columnRef.nativeElement as HTMLElement).className.includes(
          'fixed-column'
        )
      );
      // th width, height
      const thRects = columns.map((column) => {
        const rect = (
          column.nativeElement as HTMLElement
        ).getBoundingClientRect();
        return {
          width: +rect.width.toFixed(2),
          height: +rect.height.toFixed(2),
        };
      });
      // find max width, height of fixed cells
      let maxSizeRects: Array<{ width: number; height: number }> = [];
      columns.forEach((column, i) => {
        const bodyFixedCells = (
          this.tableRef.nativeElement as HTMLTableElement
        ).querySelectorAll('.fixed-column-' + i);
        const thRect = thRects[i];
        maxSizeRects.push({
          width: Math.max(
            ...Array.from(bodyFixedCells).map((cell) => {
              const cellRect = cell.getBoundingClientRect();
              return +cellRect.width.toFixed(2);
            }),
            thRect.width
          ),
          height: Math.max(
            ...Array.from(bodyFixedCells).map((cell) => {
              const cellRect = cell.getBoundingClientRect();
              return +cellRect.height.toFixed(2);
            }),
            thRect.height
          ),
        });
      });
      // tr body
      this.rowRef.changes.subscribe(() => {
        const rows = this.rowRef.toArray();
        rows.forEach((row) => {
          const columns = (row.nativeElement as HTMLElement).querySelectorAll(
            '.fixed-column'
          );
          columns.forEach((column: HTMLElement, index: number, self) => {
            const rect = maxSizeRects[index] as {
              width: number;
              height: number;
            };
            const width = rect.width + 'px';
            const height = rect.height + 'px';
            column.style.setProperty('width', width); // same width with th
            column.style.setProperty('height', height); // same width with th
            let totalWidth = 0;
            for (let i = 0; i < index; i++) {
              const rect = (columns[i] as HTMLElement).getBoundingClientRect();
              totalWidth += +rect.width.toFixed(2);
            }
            const left = index === 0 ? 0 : totalWidth;
            column.style.setProperty('left', left + 'px');
          });
        });
      });

      // calculate scroller's style
      this.scrollerStyle.marginLeft =
        maxSizeRects
          .map((size) => size.width)
          .reduce((acc: number, cur) => {
            return acc + cur;
          }, 0) + 'px';

      this.scrollerStyle.width =
        'calc(100% - ' + this.scrollerStyle.marginLeft + ')';
      // fixed column's position
      columns.forEach((columnRef: ElementRef, index: number, self) => {
        const column = columnRef.nativeElement as HTMLDivElement;
        let totalWidth = 0;
        for (let i = 0; i < index; i++) {
          totalWidth += +maxSizeRects[i].width;
        }
        const left = index === 0 ? 0 : totalWidth;
        column.style.setProperty('left', left + 'px');
        column.style.setProperty('width', maxSizeRects[index].width + 'px');
      });
    });
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: any) {
    const columnSelector = this.columnSelectorRef
      .nativeElement as HTMLDivElement;
    if (!columnSelector.contains(event.target)) {
      this.showColumnSelectorDropdown = false;
    }
  }

  @HostListener('document:scroll', ['$event'])
  public onWindowScroll(event: any) {
    if (!this.tableRef) return;
    const tableElement = this.tableRef.nativeElement as HTMLTableElement;
    // scrollbar wrapper
    const contentBottomEdge =
      tableElement.offsetTop + tableElement.offsetHeight;
    const tableRect = tableElement.getBoundingClientRect();
    const viewPortBottomEgde = window.scrollY + window.innerHeight;
    // stop fixed header
    this.stopFixedHeader();
    // case 1: viewport's top edge is scrolled over element's top edge
    // case 2: viewport's bottom edge touched element's bottom edge
    if (tableRect.y <= 0 && window.scrollY < contentBottomEdge) {
      this.startFixedHeader();
    }

    // stop fixed select all
    this.fixedSelectAll(false);
    if (
      tableRect.y - window.innerHeight <= 0 &&
      viewPortBottomEgde < contentBottomEdge
    ) {
      this.fixedSelectAll(true);
    }
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

  public fixedSelectAll(show: boolean) {
    const selectAllWrapper = this.selectAllWrapperRef
      .nativeElement as HTMLDivElement;
    if (!selectAllWrapper) return;
    selectAllWrapper.setAttribute('class', show ? 'fixed-bottom-center' : '');
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

  public onResize() {
    this.fitSizeFixedHeader();
  }
}
