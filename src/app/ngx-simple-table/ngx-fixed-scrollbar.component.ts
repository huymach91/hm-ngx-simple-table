import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'ngx-fixed-scrollbar',
  templateUrl: './ngx-fixed-scrollbar.component.html',
})
export class NgxFixedScrollbarComponent implements OnInit, AfterViewInit {
  @ViewChild('content') content: ElementRef;
  @ViewChild('wrapperRef') wrapperRef: ElementRef;
  @ViewChild('innerRef') innerRef: ElementRef;

  constructor(private element: ElementRef) {}

  ngOnInit() {
    this.init();
  }

  ngAfterViewInit() {}

  public init() {}
}
