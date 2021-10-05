import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesComponent } from './pages.component';
import { NgxSimpleTableComponent } from './ngx-simple-table.component';
import { ResizableColumnDirective } from './rezisable-column.direcitve';

@NgModule({
  declarations: [
    NgxSimpleTableComponent,
    PagesComponent,
    ResizableColumnDirective,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [NgxSimpleTableComponent],
  providers: [],
})
export class NgxSimpleTableModule {}
