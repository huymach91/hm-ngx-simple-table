import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { NgxSimpleTableModule } from './ngx-simple-table/ngx-simple-table.module';

@NgModule({
  imports: [BrowserModule, FormsModule, NgxSimpleTableModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [AppService],
})
export class AppModule {}
