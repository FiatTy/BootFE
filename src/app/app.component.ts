import { Component, OnInit, ViewChild } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { thLocale } from 'ngx-bootstrap/locale';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Bootstrap';

 
  constructor(private localeService: BsLocaleService, ) {
    defineLocale('th', thLocale);
    this.localeService.use('th');
  }

  ngOnInit(): void {
    // this.callApi();
  }

  // callApi() {

  //   this.http.get<any>(environment.rdVatVsrServiceUrl + '/users', {})
  //     .toPromise().then((response) => {
  //       console.log(response);
  //     });

  //   const params = {
  //     "firstName": "xxx",
  //     "lastName": "tentacion",
  //     "gender": "ชาย",
  //     "birthDate": "26-11-2480",
  //     "createBy": "admin"

  //   }

  // this.http.post<any>(
  //   environment.rdVatVsrServiceUrl + '/users', params
  // ).toPromise().then((response) => {
  //   console.log(response);
  // });

}


