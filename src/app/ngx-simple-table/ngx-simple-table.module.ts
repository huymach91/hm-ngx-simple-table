import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesComponent } from './pages.component';
import { NgxSimpleTableComponent } from './ngx-simple-table.component';
import { ResizableColumnDirective } from './rezisable-column.direcitve';
import { NgxFixedScrollbarComponent } from './ngx-fixed-scrollbar.component';
import { NgxFixedColumnTableComponent } from './ngx-fixed-column-table.component';

@NgModule({
  declarations: [
    NgxSimpleTableComponent,
    PagesComponent,
    ResizableColumnDirective,
    NgxFixedScrollbarComponent,
    NgxFixedColumnTableComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [NgxSimpleTableComponent, NgxFixedColumnTableComponent],
  providers: [],
})
export class NgxSimpleTableModule {}
