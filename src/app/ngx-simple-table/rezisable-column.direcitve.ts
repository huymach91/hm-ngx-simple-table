import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[resizable-column]',
})
export class ResizableColumnDirective implements AfterViewInit {
  private table: HTMLTableElement;
  private columns: NodeList;
  private currentResizer: HTMLDivElement;
  private currentCell: HTMLTableCellElement;
  private currentCellWidth: number;
  private currentPageX: number;
  private siblingCell: HTMLTableCellElement;
  private siblingCellWidth: number;
  private isMouseDown: boolean;

  constructor(private element: ElementRef) {
    this.table = this.element.nativeElement;
  }

  ngAfterViewInit() {
    this.init();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isMouseDown || !this.currentResizer) return;
    console.log('mmove');
    this.resize(event);
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (this.currentResizer) {
      this.currentResizer.style.setProperty('height', '100%');
    }
    this.currentCell = null;
    this.siblingCell = null;
    this.currentResizer = null;
    this.siblingCellWidth = null;
    this.currentPageX = null;
  }

  private init() {
    this.columns = this.table.querySelectorAll('thead tr th');
    this.columns.forEach((column: HTMLElement, index: number) => {
      if (index === this.columns.length - 1) return;
      column.style.setProperty('position', 'relative');
      const resizer = this.createResizer();
      this.setDrag(resizer);
      column.appendChild(resizer);
    });
  }

  private setDrag(resizer: HTMLDivElement) {
    resizer.addEventListener('mousedown', (mdEvent) => {
      this.isMouseDown = true;
      this.currentResizer = resizer;
      this.currentCell = resizer.parentElement as HTMLTableCellElement;
      this.siblingCell = this.currentCell
        .nextElementSibling as HTMLTableCellElement;
      this.currentPageX = mdEvent.pageX;
      this.currentCellWidth = this.currentCell.offsetWidth;
      if (this.siblingCell) {
        this.siblingCellWidth = this.siblingCell.offsetWidth;
      }
    });
  }

  private createResizer(): HTMLDivElement {
    const resizer = document.createElement('div');
    resizer.style.setProperty('width', '2px');
    resizer.style.setProperty('position', 'absolute');
    resizer.style.setProperty('background-color', 'red');
    resizer.style.setProperty('top', '0');
    resizer.style.setProperty('cursor', 'col-resize');
    resizer.style.setProperty('right', '-1px');
    resizer.style.setProperty('height', '100%');
    return resizer;
  }

  private resize(event: MouseEvent) {
    if (this.currentCell) {
      const height =
        (this.table.querySelector('thead') as HTMLElement).offsetHeight +
        (this.table.querySelector('tbody') as HTMLElement).offsetHeight;
      this.currentResizer.style.setProperty('height', height + 'px');
      var diffX = event.pageX - this.currentPageX;
      if (this.siblingCell) {
        this.siblingCell.style.width = this.siblingCellWidth - diffX + 'px';
        this.currentCell.style.width = this.currentCellWidth + diffX + 'px';
      }
    }
  }
}
