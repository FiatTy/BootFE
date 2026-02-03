import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ThDatePipe } from './pipe/th-date.pipe';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ThDathTubPipe } from './pipe/th-dath-tub.pipe';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { TableComponent } from './table/table.component';
import { TablebackendComponent } from './tablebackend/tablebackend.component';
import { VulnerableTestComponent } from './vulnerable-test/vulnerable-test.component';
import { MemoryLeakComponent } from './memory-leak/memory-leak.component';

@NgModule({
  declarations: [
    AppComponent,
    ThDatePipe,
    ThDathTubPipe,
    NavbarComponent,
    TableComponent,
    TablebackendComponent
    ,
    VulnerableTestComponent,
    MemoryLeakComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NzTableModule,
    ModalModule,
    BsDatepickerModule.forRoot(),
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
