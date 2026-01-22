import { Component, OnInit } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { thBeLocale } from 'ngx-bootstrap/locale';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  currentDate = new Date();
  currentTime = '';

  constructor(private localeService: BsLocaleService) { }

  ngOnInit(): void {
    defineLocale('th', thBeLocale);
    this.localeService.use('th');
    this.updateTime();
  }

  updateTime() {
    setInterval(() => {
      this.currentDate = new Date();
      this.currentTime = this.currentDate.toLocaleTimeString('th-TH');
    }, 1000);
  }

}
