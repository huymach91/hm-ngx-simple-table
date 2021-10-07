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
    const contentBottomEdge =
      this.content.offsetTop + this.content.offsetHeight;
    const contentRect = this.content.getBoundingClientRect();
    // view port
    const viewPortBottomEgde = contentRect.bottom + window.innerHeight;
    const viewPortTopEgde = contentRect.top;
    // case 1: view port's bottom edge was greater or equal the offset top of the scrollbar. In other word, bottom edge touches the scrollbar position
    if (viewPortBottomEgde <= contentBottomEdge || viewPortTopEgde >= 0) {
      this.stopFixed();
      return;
    }
    this.startFixed();
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
