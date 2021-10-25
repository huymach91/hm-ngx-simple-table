import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { NgxSimpleTableModule } from './ngx-simple-table/ngx-simple-table.module';
import { CommonModule } from '@angular/common';
import { DemoFixedColumnTableComponent } from './demo-fixed-column-table.component';

@NgModule({
  imports: [BrowserModule, CommonModule, FormsModule, NgxSimpleTableModule],
  declarations: [AppComponent, DemoFixedColumnTableComponent],
  bootstrap: [AppComponent],
  providers: [AppService],
})
export class AppModule {}
