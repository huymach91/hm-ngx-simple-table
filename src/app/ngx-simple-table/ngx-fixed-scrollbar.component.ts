import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'ngx-fixed-scrollbar',
  templateUrl: './ngx-fixed-scrollbar.component.html',
  styleUrls: ['./ngx-fixed-scrollbar.component.scss'],
})
export class NgxFixedScrollbarComponent implements OnInit, AfterViewInit {
  @ViewChild('content') content: ElementRef;
  @ViewChild('wrapperRef') wrapperRef: ElementRef;
  @ViewChild('innerRef') innerRef: ElementRef;

  @Input('fixedScrollbar') fixedScrollbar: boolean;

  constructor(private element: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.init();
  }

  public init() {
    // content
    const contentWrapper = this.content.nativeElement as HTMLDivElement;
    const contentWrapperWidth = contentWrapper.offsetWidth;
    const contentWidth = contentWrapper.querySelector('table').offsetWidth;

    //wrapper scrollbar
    const scrollbarWrapper = this.wrapperRef.nativeElement as HTMLDivElement;
    scrollbarWrapper.style.setProperty('width', contentWrapperWidth + 'px');
    scrollbarWrapper.onscroll = (event: any) => {
      const scrollLeft = scrollbarWrapper.scrollLeft;
      contentWrapper.scrollLeft = scrollLeft;
    };

    // inner scrollbar
    const inner = this.innerRef.nativeElement as HTMLDivElement;
    inner.style.setProperty('width', contentWidth + 'px');
  }
}
