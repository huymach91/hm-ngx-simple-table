import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
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
  @ViewChild('contentRef') contentRef: ElementRef;
  @ViewChild('wrapperRef') wrapperRef: ElementRef;
  @ViewChild('innerRef') innerRef: ElementRef;

  @Input('fixed') fixed: boolean;

  private content: HTMLDivElement;
  private scrollbarWrapper: HTMLDivElement;
  private scrollbarInner: HTMLDivElement;

  constructor(private element: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.init();
  }

  @HostListener('document:scroll', ['$event'])
  public onWindowScroll(event: any) {
    // scrollbar wrapper
    const scrollbarOffsetTop = this.scrollbarWrapper.offsetTop;
    const scrollbarRect = this.scrollbarWrapper.getBoundingClientRect();
    // view port
    const viewPortBottomEgde = scrollbarRect.y + window.innerHeight;
    // case 1: view port's bottom edge was greater or equal the offset top of the scrollbar. In other word, bottom edge touches the scrollbar position
    if (viewPortBottomEgde >= scrollbarOffsetTop) {
      return;
    }
    // case 2: user scroll up the window
  }

  public init() {
    // content
    this.content = this.contentRef.nativeElement as HTMLDivElement;
    const contentWrapperWidth = this.content.offsetWidth;
    const contentWidth = this.content.querySelector('table').offsetWidth;

    //wrapper scrollbar
    this.scrollbarWrapper = this.wrapperRef.nativeElement as HTMLDivElement;
    this.scrollbarWrapper.style.setProperty(
      'width',
      contentWrapperWidth + 'px'
    );
    this.scrollbarWrapper.onscroll = (event: any) => {
      const scrollLeft = this.scrollbarWrapper.scrollLeft;
      this.content.scrollLeft = scrollLeft;
    };

    // inner scrollbar
    this.scrollbarInner = this.innerRef.nativeElement as HTMLDivElement;
    this.scrollbarInner.style.setProperty('width', contentWidth + 'px');
  }

  private startFixed() {
    // content
    const contentOffsetLeft = this.content.offsetLeft;
    const scrollbarWrapper = this.wrapperRef.nativeElement as HTMLDivElement;
  }

  private stopFixed() {}
}
