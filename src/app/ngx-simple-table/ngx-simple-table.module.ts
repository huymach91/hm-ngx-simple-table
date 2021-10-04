import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesComponent } from './pages.component';
import { NgxSimpleTableComponent } from './ngx-simple-table.component';

@NgModule({
  declarations: [NgxSimpleTableComponent, PagesComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [NgxSimpleTableComponent],
  providers: [],
})
export class NgxSimpleTableModule {}
