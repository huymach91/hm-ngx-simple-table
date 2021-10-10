import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
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

  @Output('onScroll') onScroll = new EventEmitter();

  private content: HTMLDivElement;
  private scrollbarWrapper: HTMLDivElement;
  private scrollbarInner: HTMLDivElement;

  constructor(private element: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.init();
  }

  @HostListener('document:scroll', [])
  public onWindowScroll() {
    // scrollbar wrapper
    const contentTopEdge = this.content.offsetTop;
    const contentBottomEdge = contentTopEdge + this.content.offsetHeight;
    const contentRect = this.content.getBoundingClientRect();
    // view port
    const viewPortBottomEgde = window.scrollY + window.innerHeight;
    // case 1: viewport's top edge is scrolled over element's top edge
    if (contentRect.y > 200) {
      this.stopFixed();
      return;
    }
    // case 2: viewport's bottom edge touched element's bottom edge
    if (viewPortBottomEgde >= contentBottomEdge) {
      this.stopFixed();
      return;
    }
    this.startFixed();
  }

  @HostListener('window:resize', [])
  public onWindowResize() {
    this.updateScrollBarWidth();
  }

  public init() {
    this.content = this.contentRef.nativeElement as HTMLDivElement;
    this.scrollbarWrapper = this.wrapperRef.nativeElement as HTMLDivElement;
    this.scrollbarInner = this.innerRef.nativeElement as HTMLDivElement;
    // create size
    this.updateScrollBarWidth();
    // handle scroll
    this.scrollbarWrapper.onscroll = (event: any) => {
      const scrollLeft = this.scrollbarWrapper.scrollLeft;
      this.content.scrollLeft = scrollLeft;
      this.onScroll.emit(scrollLeft);
    };
  }

  private updateScrollBarWidth() {
    const contentWrapperWidth = this.content.offsetWidth;
    const contentWidth = this.content.querySelector('table').offsetWidth;
    //wrapper scrollbar
    this.scrollbarWrapper.style.setProperty(
      'width',
      contentWrapperWidth + 'px'
    );
    // inner scrollbar
    this.scrollbarInner.style.setProperty('width', contentWidth + 'px');
  }

  private startFixed() {
    // content
    const contentOffsetLeft = this.content.offsetLeft;
    this.scrollbarWrapper.style.setProperty('position', 'fixed');
    this.scrollbarWrapper.style.setProperty('left', contentOffsetLeft + 'px');
    this.scrollbarWrapper.style.setProperty('bottom', '0');
  }

  private stopFixed() {
    this.scrollbarWrapper.style.removeProperty('position');
    this.scrollbarWrapper.style.removeProperty('left');
    this.scrollbarWrapper.style.removeProperty('bottom');
  }
}
