import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  @Input('currentPage') set setCurrentPage(currentPage: number) {
    this.currentPage = currentPage;
    this.paging();
  }
  @Input('pageSize') set setPageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.paging();
  }
  @Input('totalRecord') set setTotalRecord(totalRecord: number) {
    this.totalRecord = totalRecord;
    this.paging();
  }

  @Input('background') background: string;
  @Output('onChangePaginator') _onChangePaginator = new EventEmitter();

  public currentPage = 1;
  public pageSize = 10;
  public totalRecord = 0;
  public pages = [];
  public pageSizeList = [10, 25, 50, 100];
  public startPage = 1;
  public endPage = 1;
  public interval = 3;

  constructor() {}

  ngOnInit() {
    this.paging();
  }

  private paging() {
    this.pages = [];
    if (this.pageSize > 0 && this.totalRecord > 0) {
      const pageNumbers = Math.ceil(this.totalRecord / this.pageSize);
      for (let i = 1; i <= pageNumbers; i++) {
        this.pages.push(i);
      }
      this.setStartEndPage();
    }
  }

  private setStartEndPage() {
    this.startPage =
      this.currentPage - this.interval <= 1
        ? 1
        : this.currentPage - this.interval;
    this.endPage =
      this.currentPage + this.interval >= this.pages.length
        ? this.pages.length
        : this.currentPage + this.interval;
  }

  public onChangePaginator(pageNumber: number) {
    this.currentPage = pageNumber;
    this._onChangePaginator.emit({
      currentPage: Number(this.currentPage),
      pageSize: Number(this.pageSize),
    } as any);
  }
}
